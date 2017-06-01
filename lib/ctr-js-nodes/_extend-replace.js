const _        = require('lodash');
const evalPlug = require('./plugin/local-eval.js');
const fuzzy    = require('./../util/fuzzy-error.js');

 /**
  * Recursivly search the source object for extend matches, and then
  * configing and replacing the extend with said extend class
  * @param  {obj} source  -> source object to search
  * @return {obj}         -> source object with class data merged if any
  */
const _extendReplace = function (source) {
  const self = this;
  const localVarKey = self.localVarKey;
  const extendReg = /^extend-/gi;

  /**
   * Replaces the extend class with the corrosponing class data
   * @param  {str} classKey     -> class string to look up
   * @param  {---} extendVarObj -> bln or obj, depending if there is extend
   *                                vars to work with
   * @return {obj}              -> extend class data
   */
  const extendReplace = function (classKey, extendVarObj = false) {
    let extend = self.ctrClass.get(classKey);
    // if not found throw error
    if (!extend) {
      //fuzzy this muddy scruffy
      const fuzzyError = fuzzy(classKey, [...self.ctrClass.keys()]);
      self._throwErr({
        error: 'Extend class not found',
        msg: `| Could not find: the "${classKey}" class, either you forgot to
            | add the class or you misspelled the class. I'll run a fuzzy search
            | against all your classes so you can check if it's the latter.
            | ${fuzzyError}`,
        format: false
      });
      return {};
    }

    //conver immt to js obj
    extend = extend.toJS();

    //check for presets
    if (_.has(extendVarObj, 'preset') && _.has(extend, [localVarKey, 'preset'])) {
      const presetLookup = _.get(extend, [localVarKey, 'preset']);
      //get the preset and format into an array
      let preset = _.get(extendVarObj, 'preset');
      preset = _.isArray(preset) ? preset : [preset];
      //revers loop to merge
      for (let i = preset.length - 1; i >= 0; i--) {
        //check if the preset key is present in the class
        if (_.has(presetLookup, preset[i])) {
          //get and check format before we merge the preset in to the local val
          const _preset = _.get(presetLookup, preset[i]);
          if (_.isPlainObject(_preset)) {
            extend[localVarKey] = self._h.defaultsDeep(_preset, extend[localVarKey]);
          }
        }
      }
      //remove preset from extend
      extendVarObj = _.omit(extendVarObj, 'preset');
    }
    //remove preset from extend if present
    extend = !_.has(extend, 'preset') ? extend : _.omit(extend, 'preset');

    //check if for local var obj otherwise create
    extend[localVarKey] = _.has(extend, [localVarKey]) ? extend[localVarKey] : {};
    //check for extend var object which alters the local vars of class
    if (extendVarObj) {
      extend[localVarKey] = self._h.defaultsDeep(extendVarObj, extend[localVarKey]);
    }

    //get local  class vars
    let replacer = _.get(extend, localVarKey);
    extend = _.omit(extend, [localVarKey]);
    //extend vars specified in global under extend.<key>
    const replacerGlobal = self.vars.hasIn(['extend', classKey])
                         ? self.vars.getIn(['extend', classKey]).toJS()
                         : false;
    //merge in global replacer if present
    replacer = !replacer ? replacerGlobal
             : replacerGlobal
             //has replacerGlobal
             ? self._h.defaultsDeep(replacerGlobal, replacer)
             : replacer;

    //private vars check
    if (replacer) {
      //first we do a replacer update
      replacer = self._objectReplace(replacer, replacer, {localVarUpdate: true});
      //tobe class entry point for local plugin
      replacer = evalPlug(replacer);
      //replace private vars
      extend = self._objectReplace(extend, replacer, {
        privateReplacer: true
      });
    }

    //gloabl replace of rc + replacer, global vars trump replacer due to private var feat
    replacer = !self.vars.toJS() ? replacer : self._h.defaultsDeep(self.vars.toJS(), replacer);
    //merge in specific if any
    replacer = !extendVarObj ? replacer : self._h.defaultsDeep(extendVarObj, replacer);
    if (replacer) {
      //no global vars just local replacer
      extend = self._objectReplace(extend, replacer, {
        reportError: true
      });
    }
    return extend;
  };


  /**
   * Configs/formates the extend object so all things are like to be processed
   * and then replaced.
   * @param  {obj} extend    -> extend Object to process
   * @param  {obj} objSource -> object source which extend originated from
   * @param  {str} extendKey -> the key of extend
   * @return {obj}           -> source object with extend class data merged in
   */
  const extendConfig = function (extend, objSource, extendKey = 'extend') {
    //set defaults
    let common = null;

    //check/config data for object syntax
    const objSyntax = _.every(_.omit(extend, 'class'), _.isPlainObject)
                    && _.size(_.omit(extend, 'class'));
    if (objSyntax) {
      //check to see if class array to work with
      let classKeys = _.has(extend, 'class') ? _.get(extend, 'class') : false;
      //convert to array if present and or if string
      classKeys = !classKeys ? [] : _.isArray(classKeys) ? classKeys : [classKeys];
      //remove from obj
      extend = !classKeys ? extend : _.omit(extend, 'class');

      //check for common extend vars
      common = _.get(extend, localVarKey);
      extend = !common ? extend : _.omit(extend, [localVarKey]);
      let selectKeys = !common ? false : _.get(common, 'class');
      //check formate and convert to array need be
      selectKeys = !selectKeys ? selectKeys : _.isArray(selectKeys) ? selectKeys : [selectKeys];
      //remove from common, no need, stored in select keys
      common = !common ? common : _.omit(common, 'class');

      //crease key list for cycle refs and set
      const keys = _.union(_.keys(extend), classKeys);
      extend.class = keys;
      //check keys for ::: syntax
      _.forEach(keys, function (key) {
        //check for noation, and then if key has class, if not add it
        if (key.includes(':::') && !_.has(extend, [key, 'class'])) {
          extend[key].class = key.replace(/:::.*/g, '');
        }
      });

      //merge in common if present
      extend = !common ? extend : _.reduce(keys, function (prv, key) {
        //check for $$ key in common -> select keys only
        if (!selectKeys || _.includes(selectKeys, key)) {
          prv[key] = !prv[key] ? common : self._h.defaultsDeep(prv[key], _.cloneDeep(common));
        }
        return prv;
      }, extend);
    }

    //check if user is using shorthand syntax, if so format
    extend = _.isString(extend) || _.isArray(extend)
           ? {class: extend}
           : extend;

    //return updated objectSource
    return _.reduce(_.isArray(extend.class) ? extend.class : [extend.class], function (prv, key) {
      let classData = !objSyntax ? common
                                 : self._h.defaultsDeep(_.get(extend, key) || {});
      //check to see if class is define in data
      if (_.has(classData, 'class')) {
        key = classData.class;
        classData = _.omit(classData, 'class');
      }
      //send off to be configed and merge back in
      return key ? self._h.defaultsDeep(prv, extendReplace(key, classData)) : prv;
    }, _.omit(objSource, extendKey));
  };


  /**
   * Loops through the object props and searches for extend matches
   * if found it sends the match off to config to be configed
   * @param  {obj} objSource -> source object to search
   * @return {obj}           -> source object with extend class data merge if any
   */
  const extendFind = function (objSource) {
    //loop de loop through object
    for (const property in objSource) {
      if (objSource.hasOwnProperty(property)) {
        const extend = _.get(objSource, 'extend');
        //extend key
        if (extend) {
          objSource = extendConfig(extend, objSource);
        }
        //regex extend match
        if (property.match(extendReg)) {
          const extendClass = property.replace(extendReg, '');
          //regex match format wrap
          objSource = extendConfig({
            [extendClass]: objSource[property]
          }, objSource, property);
        }
        //object, lets go another level deeper
        if (_.isPlainObject(objSource[property])) {
          objSource[property] = extendFind(objSource[property]);
        }
      }
    }
    //source return
    return objSource;
  };

  //lets inception this shit, how deep will we go, no one knows
  return extendFind(source);
};

module.exports = _extendReplace;
