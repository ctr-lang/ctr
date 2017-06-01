const _         = require('lodash');
const Immutable = require('immutable');

/**
 * Adds class that then can be accsessed through this.ctrClass
 * @param {---} className -> string name | obj Syntax
 * @param {obj} classData -> class data | option
 * @param {obj} option    -> option to overwrite class if dup
 */
const setClass = function (className, classData = false, option = {}) {
  const self = this;
  option = _.defaults(option, {overwrite: false, classDuplicateWarning: true});

  /**
   * Wrapper around class set, checks for dups otherwise sets
   * @param {str} key -> name of class
   * @param {obj} val -> class data
   */
  const addClass = function (key, val) {
    //throw globals if any, which can happen if importing class data from yaml
    if (_.includes(['$ctr-option', 'option', self.localVarKey], key)) { return; }
    const stringifyVal = JSON.stringify(val);
    const rawMatch = self._ctrClassRaw.get(key) === stringifyVal;
    //not overwriting, dup error option, classLock, has class, class was changed from orig
    if (!option.overwrite && self.globalOption.get('classLock') === true && self.ctrClass.has(key) && !rawMatch) {
      if (option.classDuplicateWarning) {
        //throw warning about class dups
        self._throwErr({
          error: 'Alteration or Duplicate Class Warning',
          msg: `Oh dear, it looks like you have the classLock on, and you are
                attempting to alter of duplicate the "${key}" class.
                You can either use a diffrent class name, turn off the classLock
                global option, or pass {overwrite: true} option object as the
                last argument. Tread with caution!`
        });
      }
    }else if (!self.ctrClass.has(key) || !rawMatch) {
      //add raw for latter above comparision
      self._ctrClassRaw = self._ctrClassRaw.set(key, stringifyVal);

      //This first pass of the data through objectReplace is a "mergeRun"
      //in that we are only checking for raw merge or mergeWith values
      val = self._objectReplace(val, false);
      //check for extend in class
      val = self._extendReplace(val);

      /**
       * This function acts just like Immutable.fromJs although it will perserve
       * the order which is really fucking important
       * @param  {obj} js -> data to be converted to Immut
       * @return {---}    -> Immut struc
       */
      const fromJSOrdered = function (_val) {
        return !_.isObject(_val) || _.isNull(_val)
               ? _val
               : _.isArray(_val)
               ? Immutable.Seq(_val).map(fromJSOrdered).toList()
               : Immutable.Seq(_val).map(fromJSOrdered).toOrderedMap();
      };
      // set class data
      self.ctrClass = self.ctrClass.set(key, fromJSOrdered(val));
    }
  };

  //check for obj data struc
  if (!classData && _.isPlainObject(className)) {
    //resaing only if classData object
    option = _.isPlainObject(classData) ? classData : option;
    classData = className;
    //check for global var options, set, and remove if so
    const localKey = self.localVarKey;
    const globalVars = _.has(classData, localKey) ? _.get(classData, localKey) : false;
    classData = !globalVars ? classData : _.omit(classData, [localKey]);
    //cycle, merge global, and add
    _.forEach(className, function (val, key) {
      if (globalVars) {
        val[localKey] = self._h.defaultsDeep(val[localKey] || {}, _.cloneDeep(globalVars));
      }
      addClass(key, val);
    });
  }else if (_.isString(className) && _.isPlainObject(classData)) {
    addClass(className, classData);
  }else {
    //format error
    self._throwErr({
      error: 'Format',
      msg: `The "setClass | addClass" method only arguments must either be a (String, Object),
            or just a (Object).`
    });
  }

  return self;
};

module.exports = setClass;
