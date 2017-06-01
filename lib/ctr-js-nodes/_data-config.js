const _         = require('lodash');
const evalPlug  = require('./plugin/local-eval.js');


/**
 * Private -> called by render to configure and assign the data
 * Not all to sure how I actually feel about the current pipeline of data,
 * with all this freedom comes some all these complications
 * @return {obj} -> {selector, data, option}
 */
const _dataConfig = function (selector, data, option = {}) {
  const self = this;
  const localVarKey = self.localVarKey;
  const args = [...arguments];

  //set selector for error ref
  self._selector = selector;

  //set vars from constructor, and recall with self args
  if (_.every(args, _.isUndefined)) {
    return self._dataConfig(...self.args);
  }

  //assume yaml convert
  if (_.isString(data)) {
    data = self._parseYaml(data, true, option);
  }

  //This first pass of the data through objectReplace is a "mergeRun"
  //in that we are only checking for raw merge or mergeWith values
  data = self._objectReplace(data, false);

  /**
   * Local var update of itself
   * @param  {obj} _local -> the local var obj to update
   * @param  {bln} check  -> to check if we should update
   * @return {obj}        -> local
   */
  const localUpdate = function (_local, check = true) {
    let run = !check;
    if (check) {
      //check local var
      run = _local.variableUpdate === true;
      //check options
      run = run ? run : self.globalOption.get('variableUpdate');
    }
    return !run ? _local : self._objectReplace(_local, _local, {
      localVarUpdate: true,
      reportError: true
    });
  };

  /**
   * Local plugin update
   * @param  {obj} _local -> local obj to  update
   * @param  {bln} check  -> to check if we should update
   * @return {obj}        -> local
   */
  const localPlugin = function (_local, check = true) {
    let run = !check;
    if (check) {
      //check local var
      run = _local._localVarPlugin_ === true;
      //check options
      run = run ? run : self.globalOption.get('_localVarPlugin_');
    }
    //In the future this will be an entry point for local varible plugins
    //as of right now I'm just going to hard code in the eval plugin
    return !run ? _local : evalPlug(_local);
  };

  /**
   * Check/update priavet vars in data object
   * @param  {obj} _data  -> data object to update
   * @param  {obj} _local -> local replacer
   * @param  {bln} check  -> to check if we should update
   * @return {obj}        -> data with private vars replaced
   */
  const localPrivate = function (_data, _local, check = true) {
    let run = !check;
    if (check) {
      //check local var
      run = self._h.get(_local, ['privateVariable', '_private_']) === true;
      //check options
      run = run ? run : self.globalOption.get('privateVariable');
    }
    return !run ? _data : self._objectReplace(_data, _local, {
      privateReplacer: true
    });
  };

  let local = null;
  let replaced = false;
  //check to see if there is any private $$ which are set internally
  //if so, it means localVarKey has been pulled and renamed to __$local$__
  //we use __$local$__ becuase its assumed the data is yaml thus we apply
  //extra data transforms, replacerUpate, plugings. In js there really is no need
  if (data.__$local$__) {
    replaced = true;
    local = data.__$local$__;
    //recursivly replace itsself
    local = localUpdate(local, false);
    // local = evalPlug(local);
    local = localPlugin(local, false);
    //local vars trump setVars
    local = !self.vars.size
            ? local
            : self._h.defaultsDeep(local, self.vars.toJS());
    //private var check
    data = localPrivate(data, local);

    //remove and replace
    data = self._objectReplace(_.omit(data, ['__$local$__']), local, {
      reportError: true
    });
  }

  //check global setVars
  if (!replaced && self.vars.size) {
    replaced = _.has(data, localVarKey);
    local = replaced
            //local vars trump setVars
          ? self._h.defaultsDeep(_.get(data, localVarKey), self.vars.toJS())
          : self.vars.toJS();
    //check for local var update
    local = localUpdate(local);
    local = localPlugin(local);
    //private var check
    data = localPrivate(data, local);

    //remove and replace
    data = self._objectReplace(_.omit(data, [localVarKey]), local, {
      reportError: true
    });
  }

  //$$ replacer object inside the data
  if (!replaced &&  _.has(data, localVarKey)) {
    local = _.get(data, localVarKey);
    //check for local var update
    local = localUpdate(local);
    local = localPlugin(local);
    //private var check
    data = localPrivate(data, local);

    //remove and replace
    data = self._objectReplace(_.omit(data, [localVarKey]), local, {
      reportError: true
    });
  }

  //check for extend if ctrClass present
  data = !self.ctrClass.size ? data : self._extendReplace(data);

  //selector error check
  if (!_.isString(selector)) {
    self.error = {
      error: 'Format',
      msg: 'The first argument has to be either a string or a object. Current:' + selector
    };
    self._throwErr(self.error);
  }

  return {
    selector,
    data,
    option
  };
};


module.exports = _dataConfig;
