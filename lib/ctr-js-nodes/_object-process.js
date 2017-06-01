const _         = require('lodash');
const Immutable = require('immutable');

/**
 * Processes Object data individually to avoid the need for duplicate
 * and repetitive logic, plus uneeded overhear. Takes Object data, extracts
 * globals, cycles the data stlyes and injects globals.
 * @param  {obj} data -> data Object
 * @param  {fnc} fn   -> the function to apply the formated data to which
 *                       is paritaly applied
 * @return {---}      -> self ref
 */
const _objectProcess = function (data, fn) {
  const self = this;
  const localVarKey = self.localVarKey;

  //global data config
  const globalVars = ['$ctr-option', 'option', localVarKey];
  const globalData = _.reduce(globalVars, function (map, val) {
    //if data has val, create/set map + remove from data
    if (_.has(data, val)) {
      //using immutable so I can sleep easy at night
      map = map ? map : Immutable.Map();
      map = map.set(val, _.get(data, val));
      data = _.omit(data, val);
    }
    return map;
    //set private ref so we know we are dealing with yaml in obj replace
  }, false);

  /**
   * Process each yaml object instance and processes it accordingly
   * @param  {obj} obj -> data yaml object to process
   * @param  {str} key -> key of the data object
   */
  const processInstance = function (obj, key) {
    //regular ctr instance
    if (!key.startsWith('ctr:::')) {
      obj = !globalData ? obj : self._h.defaultsDeep(obj, globalData.toJS());
      //pull/assing local var
      if (_.has(obj, localVarKey)) {
        obj.__$local$__ = _.get(obj, localVarKey);
        obj = _.omit(obj, [localVarKey]);
      }
      fn.apply(self, [key, obj]);
    }else {
      //set options/vars
      _.forEach(['ctr:::reset', 'ctr:::development', 'ctr:::setReset', 'ctr:::setOption', 'ctr:::setVariable', 'ctr:::setVar'], function (_key) {
        const reg = new RegExp(`^${_key}`);
        if (reg.test(key)) {
          //check for special yaml option obejct, ie, the second object arg for yaml
          const option = _.has(obj, 'ctr:::option') ? _.get(obj, 'ctr:::option') : {};
          obj = _.isEmpty(option) ? obj : _.omit(obj, 'ctr:::option');
          self[_key.replace(/^ctr:::/, '')](obj, option);
        }
      });

      //set classes
      if (key.startsWith('ctr:::setClass:')) {
        self.setClass(key.replace(/ctr:::setClass:/, ''), obj);
      }else if (key.startsWith('ctr:::addClass:')) {
        self.setClass(key.replace(/ctr:::addClass:/, ''), obj);
      }
    }
  };

  /**
   * Cylce the object data and process each root child Object
   */
  _.forEach(data, function (obj, key) {
    processInstance(obj, key);
  });

  //->
  return self;
};

module.exports = _objectProcess;

