const _         = require('lodash');
const Immutable = require('immutable');
const helperKey = require('./helper-keys.js');
const throwErr  = require('./helper-throw-err.js');
const _M        = require('../manager/manager-index.js');

const util = {
  /**
   * Why is right. And its you loash or is it me? With all this object play
   * I'm not sure who is to blame. But I need to leave I need a stable
   * partner; a partner whos output I can aways count on.
   * @param  {obj} srcObj -> The source object to be merged into
   * @param  {arg} ...    -> Objs to be mergered are passed as args
   * @param  {bln} o..    -> Overite into scrObj need be
   * @return {obj}        -> Merged object
   */
  merge: function (srcObj) {
    const self = this;
    //clone to be safe and break and refs
    srcObj = _.cloneDeep(srcObj) || {};
    let args = new Array(arguments.length);
    let overwrite = false;

    //cycle args which will be objs to be merged into
    for (let i = 0; i < args.length; ++i) {
      //checks for true as last arg for overwrite
      if (i + 1 === args.length && arguments[i] === true) {
        overwrite = true;
      }else {
        args[i] = arguments[i];
      }
    }

    /*
    Wrapper funk to merge obj into the sorce obj, its inkvoked
    via the bellow loop
     */
    const mergeObject = function  (obj) {
      //clone to be safe and break and refs
      obj = _.cloneDeep(obj);
      //cycle keys
      for (let key in obj) {
        if ({}.hasOwnProperty.call(obj, key)) {
          let value = obj[key];
          //no val
          if (_.isUndefined(srcObj[key])) {
            srcObj[key] = value;
          }else if (value && value.constructor === Object) {
            //obj val, check if the src obj is an object if so
            //try to merge where possible
            if (_.isPlainObject(srcObj[key])) {
              srcObj[key] = self.merge(srcObj[key], value, overwrite);
            }else if (overwrite) {
              srcObj[key] = value;
            }
          }else if (overwrite) {
            srcObj[key] = value;
          }
        }
      }
    };

    //loop through args
    for (let i = 1; i < args.length; i++) {
      const obj = args[i];
      //make sure object is not empty
      if (!_.isEmpty(obj)) {
        //merge obj into srcObj
        mergeObject(obj);
      }
    }

    //-> `merege` return
    return srcObj;
  },

  /**
   * Wrapper for merging to keep things alike, merges deeply
   * @param  {map} map         -> merge scr
   * @param  {obj || map} data -> data to merge into src
   * @return {map}             -> merged
   */
  mergeImmut: function (map, data) {
    //conver data first if not immut
    if (!Immutable.Map.isMap(data)) {
      //check to make sure not empty
      if (_.isEmpty(data)) {
        return map;
      }
      //convert
      data = Immutable.fromJS(data);
    }
    //merge deep
    return data.mergeDeep(map);
  },

  /**
   * Will set or merge in a immutable map
   * @param {str} key     -> key in question
   * @param {map} srcMap  -> souce
   * @param {map} dataMap -> to merge into source
   */
  setOrMerge: function (key, srcMap, dataMap) {
    if (srcMap.has(key)) {
      return srcMap.updateIn([key], function (map) {
        return map.mergeDeepWith(function (prev) {
          //allways keep orig
          return prev;
        }, dataMap.get(key));
      });
    }
    return srcMap.set(key, dataMap.get(key));
  },

  _id: {
    /**
     * Generates a hash id based on srting
     * @param  {str} str -> String from JSON.strigifiy(option)
     * @return {str}     -> HashId
     */
    hash: function (str) {
      let hash = 0, len = str.length;
      if (len === 0) { return hash; }
      for (let i = 0; i < len; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        // Convert to 32bit integer
        hash &= hash;
      }
      return hash;
    },
    /**
     * Generates random id
     * @param  {str} prefix -> prefixed key
     * @return {str}        -> id
     */
    gen: function (prefix = '_id') {
      return prefix + '-' + Math.random().toString(36).substr(2, 9);
    }
  },

  getOption: function (data) {
    let option = data.option || false;

    if (!option) {
      option = {};
    }
    //remove option
    data = _.omit(data, 'option');
    //check for inheritProps
    if (option.inheritProps === true || option.inheritProperty) {
      //set temp
      data.__inheritProps__ = 'true';
    }

    return {
      data,
      option
    };
  },

  /**
   * Get the global object if any, omits it if so from the data, and if not
   * defaults to an empty obj.
   * @param  {obj} data -> data obj
   * @return {obj}      -> data/global
   */
  getGlobal: function (data, key = 'global') {
    const self = this;
    //@connected to @hacky -> state-config due to the following code
    //that was originally used
    // let globalData = data.global ? data.global : false;
    let globalData = data[key] ? data[key] : false;

    //no global
    if (!globalData && key === 'global') {
      //invoke with alis of common
      return self.getGlobal(data, 'common');
    }

    //remove key need be
    data = globalData ? _.omit(data, key) : data;
    //default or assing
    globalData = globalData ? globalData : {};

    if (!_.isEmpty(globalData)) {
      //check and move options into option object if global
      globalData = _.reduce(globalData, function (prv, _val, _key) {
        if (_.includes(['duration', 'ease', 'delay', 'property'], _key)) {
          prv.option = prv.option ? prv.option : {};
          if (!prv.option[_key]) {
            prv.option[_key] = _val;
          }
        }else if (_key === 'option') {
          prv.option = _.defaults(_val, prv.option);
        }else {
          prv[_key] = _val;
        }
        return prv;
      }, {});
    }

    return {
      globalData,
      data
    };
  },


  /**
   * Merges in the common/global data
   * @param  {obj} options.val        -> src data to recive common
   * @param  {str} options.key        -> key of data obj
   * @param  {obj} options.globalData -> common data
   * @param  {str} options.context    -> needed for states merge since it be
   *                                     mergin on indv level -> on/non
   * @return {obj}                    -> common data merged
   */
  mergeGlobal: function ({val, key, globalData, context}) {
    //if key of true it means asing the global data to key
    if (val === true) { return globalData; }

    /**
     * Helpers that gets based on path, formates into array, and pull, or defualts
     */
    const getFormatPull = function (obj, paths = [], defaultRtn = undefined) {
      //to array helper
      const toArr = function (_val) {
        return _val && !_.isArray(_val) ? [_val] : _val;
      };
      //loop to get
      for (let i = 0; i < paths.length; i++) {
        const res = _.get(obj, paths[i]);
        if (res) {
          //remove/return
          _.unset(obj, paths[i]);
          return {obj, res: toArr(res)};
        }
      }
      return {obj, res: toArr(defaultRtn)};
    };

    //check for target array that specifies the "targets" to merge into
    const {res: globalTarget, obj: _globalData} = getFormatPull(
      _.cloneDeep(globalData), ['target', 'option.target']
    );
    //check omit option, omits props from the merge
    let omitList;
    ({res: omitList, obj: val} = getFormatPull(val, ['omit', 'option.omit']));
    //if true we want to omit all the common data
    omitList = _.first(omitList) === true ? _.keys(_globalData) : omitList;
    //check pick list, opposit of ommit
    let pickList;
    ({res: pickList, obj: val} = getFormatPull(val, ['pick', 'option.pick']));

    //helper to defaultsDeep, based on if there is a pick, omit, of neither
    const defaultIn = function (_val, _global) {
      //removes context need be
      const rmContext = (d) => context ? d[context] : d;
      _global = context ? {[context]: _global} : _global;
      //->
      return pickList
             //pick and merge, reducing to deepPick -> set(x.a.c, val)
             ? _.defaultsDeep(_val, _.reduce(pickList, function (prv, _key, i, col) {
               prv = !_.has(_global, _key) ? prv
                     //partial is needed other wise it treats numbers as arrays, as in 'timeline.44'
                     //will create 44 undefined arrays
                     : _.defaultsDeep(prv, _.setWith({}, _key, _.get(_global, _key), _.partial(Object, null)));
               //on last time around we need the reomve the context for finial res
               return i === (col.length - 1) ? rmContext(prv) : prv;
             }, {}))
             : omitList
             //omitlist pull and merge
             ? _.forEach(omitList, (o)=> _.unset(_global, o)) && _.defaultsDeep(_val, rmContext(_global))
             //default, reg merge
             : _.defaultsDeep(_val, rmContext(_global));
    };
    //->
    return !globalTarget
           ? defaultIn(val, _globalData)
           : _.includes(globalTarget, key)
           ? defaultIn(val, _globalData)
           : val;
  },


 /** Configs pseudo key, called from elm, attr, stata
   * @param  {str} key    -> key to be configed
   * @param  {obj} option -> option objected
   * @return {---}        -> {key, opt}
   */
  configPseudoKey: function (key, option) {
    const doubles = ['after', 'before', 'first-letter', 'first-line', 'selection',
    'backdrop', 'placeholder', 'marker', 'spelling-error', 'grammar-error'];

    //set interal appendTo
    if (key.charAt(0) !== ':') {
      let colon = option.colon || false;
      //set type of colon
      if (!colon) {
        //check global option
        if (_M._option.getIn(['global', 'doubleColon'])) {
          colon = _.includes(doubles, key) ? '::' : ':';
        }else {
          colon  = ':';
        }
      }

      //check to make sure user not psuedo override
      //set interal appendTo
      if (option.psuedo !== false && !option._appendTo) {
        option = _.cloneDeep(option);
        option._appendTo = true;
        key = colon + key;
      }
    }

    return {
      key,
      option
    };

  },

  /**
   * Hacky fix process helpers within features
   * @param  {obj} data -> data with keys
   * @return {obj}      -> transformed data
   */
  processHelper: function (objectArgs, target = false) {
    const isMap = Immutable.Map.isMap(objectArgs);
    objectArgs = isMap ? objectArgs : Immutable.fromJS(objectArgs);

    const checkFor = function (key, object = false) {
      const val = objectArgs.get(key);
      return object ? _.isPlainObject(val) : val;
    };

    //sorta hacky fix for transform and matrix. Need to convert befor processed
    if (checkFor('transform')) {
      ({objectArgs} = helperKey.transform(objectArgs));
    }else if (checkFor('matrix')) {
      ({objectArgs} = helperKey.matrix(objectArgs));
    }

    //if target we check all static, which is need to be done within trans, state, anim
    if (target) {
      objectArgs = helperKey.processHelperArgs(objectArgs, target);
    }

    return isMap ? objectArgs : objectArgs.toJS();
  },



  /*
  Deals with the regex bis, not sure if this is the most efficent way of doing
  this I'm not well versed in the dark magic of regex.
   */
  regularExp: {
    patternList: {
      animation: /^anim$|^anims$|^animation$|^animations$|^anim-|^animation-|^customAn/i,
      attribute: /^attr$|^attrs$|^attribute$|^attributes$|^attr-|^attribute-|^customAt/i,
      component: /^comp$|^comps$|^component$|^components$|^comp-|^component-|^customCo/i,
      element: /^elm$|^elms$|^element$|^elements$|^elm-|^element-|^customEl|^before$|^after$|-child$|-child\(\d+\)$|-type$|-type\(\d+\)$/i,
      grid: /^grid$|^grid-|^customGr/i,
      media: /^media$|^medias$|^media-|^customMe/i,
      non: /^not$|^non$|^nons$|^nots$|^not-|^non-|^customNo/i,
      state: /^states$|^state$|^state-|^customSt|^hover$|^hover-|^focus$|^focus-|^active$|^active-|^checked$|^checked-|^link$|^link-|^visited$|^visited-|^valid$|^valid-|^required$|^required-|^out-of-range$|^out-of-range-|^optional$|^optional-|^invalid$|^invalid-|^in-range$|^in-range-|^enabled$|^enabled-|^disabled$|^disabled-/i,
      transition: /^trans$|^transition$|^transitions$|^_transition$|^customTr/i,
      special: /^on$|^common$|^static$/i
    },
    pluralList: {
      animation: /^anims$|^animations$|^customAnims|^customAnimations/i,
      attribute: /^attrs$|^attributes$|^customAts|^customAttrs|^customAttributes/i,
      component: /^comps$|^components$|^customCos|^customComps|^customComponents/i,
      element: /^elms$|^elements$|^customEls|^customElms|^customElements/i,
      non: /^nons$|^nots$|^customNos|^customNos|^customNons|^customNots/i,
      state: /^states$|^customStates|^customSts/i,
      media: /^medias$|^customMes|^customMedias/i,
      transition: /^transitions$|^customTransitions/i
    },

    /**
     * Check key against list, used only in index.js
     * @param  {str} key             -> obj key
     * @param  {str} testAgainstList -> ref to list above
     * @return {bln}                 -> Yes or No, and no Maybe so's
     */
    keyTest: function (key, testAgainstList) {
      return this.patternList[testAgainstList].test(key);
    },

    /**
     * Check key against list to see if its a plural key
     * @param  {str} key             -> obj key
     * @param  {str} testAgainstList -> ref to list above
     * @return {bln}                 -> Yes or No, and no Maybe so's
     */
    pluralTest: function (key, testAgainstList) {
      return this.pluralList[testAgainstList].test(key);
    },


    /**
     * Checks to see if it has a match bases on the regex list above
     * @param  {str}  key     -> obj key
     * @return {bln}          -> Yes or no.
     */
    hasRegxMatch: function (key) {
      const self = this;
      //cycle through patt list
      for (let k in self.patternList) {
        if ({}.hasOwnProperty.call(self.patternList, k)) {
          const reg = self.patternList[k];
          if (reg.test(key)) {
            return true;
          }
        }
      }
      return false;
    },
    /**
     * A little missleading with the name and all but the first check we do is
     * to see if its a object. Why you might ask well what we are doing is checking
     * to see if its not only made up of all objects but not only if its made up
     * of objects which do not use the regexKeys. And checking to see if its an
     * object first is a hell of a lot less expesive then running though the regex
     * list. If that makes and sense
     * @param  {---}  val            -> The val pair of the parent object could be
     *                                  a string, obj, or array, or false, I think.
     * @param  {str}  key            -> The key pair of the parent object
     * @param  {arr}  addOnKeys      -> Add on list to check
     * @return {bln}                 -> The outcome
     */
    isAnObject: function (val, key, {addOnKeys, globalData}) {
      const self = this;
      if (key === 'option' || key === 'shorthand') {
        return false;
      }else if (_.isPlainObject(val) || (_.isPlainObject(globalData) && !_.isEmpty(globalData) && val === true)) {
        //true is for common -> key: true -> inherit
        if (addOnKeys.length) {
          return !_.includes(addOnKeys, key)
                 && !self.hasRegxMatch(key);
        }
        return !self.hasRegxMatch(key);
      }
      return false;
    }
  },

  /**
   * Sorts object props into objs, and non objs
   * @param  {obj} data   -> object to sort
   * @param  {obj} option -> options
   * @return {obj}        -> sorted
   */
  sortObjectType: function (data, option = {}) {
    const self = this;
    option = _.defaults(option, {addOnKeys: [], globalData: false});
    return _.reduce(data, function (prv, val, key) {
      const isObj = self.regularExp.isAnObject(val, key, option);
      //push res to safty
      if (isObj) {
        prv.obj.push(key);
      }else {
        prv.nonObj.push(key);
      }
      return prv;
    }, {obj: [], nonObj: []});
  },

  /**
   * What this guy does is it formats the data so we always working with the
   * correct objects. The main thing we do is see if the object is compesed up
   * of other sub-objs that need to be processed indepentandly from one another
   * if thats the case then we leave the data obj as is otherwise we what to
   * wrap that data object in the default key.
   * @param  {obj} data       -> The data object which we are currenly processing
   * @param  {str} defaultKey -> The default key we will use if its not made up
   *                             of sub objs
   * @param  {arr}  addOnKeys -> Special case keys that we also wish to check for
   * @param  {bln}  hasGlobal -> If there is global/common data which is pulled
   *                             beforehand
   * @return {obj}            -> formated or not
   */
  formatData: function (data, defaultKey, option = {}) {
    const self = this;
    option = _.defaults(option, {addOnKeys: [], globalData: false});

    //hacky fix for helpers. Need to convert befor processed
    data = self.processHelper(data);

    //Checks to see if its made up of all objs. We are using reduce here
    //rather than every which I was using before becuase this will act
    //as a saftey catch in case of improper formating.
    const objType = self.sortObjectType(data, option);
    let isAllObjs = objType.obj > objType.nonObj;

    //remove short and option due to possible false positive
    if (objType.obj.length !== 0 && objType.nonObj.length !== 0) {
      objType.nonObj = _.pull(objType.nonObj, 'option', 'shorthand');
    }

    //Alright so if this is true it means the user prbly made a mistake
    //either they are trying to create an obj that contains sub-objs
    //or they accidently throw in a obj
    if (objType.obj.length !== 0 && objType.nonObj.length !== 0) {
      //errMsg wrapper
      const errMsg = function (objs, str1, str2) {
        return ['Captain, we have a problem! In your "' + defaultKey + '" object',
                'it looks like we have something that does that belong.',
                'This object can either be made up of sub-objects or the',
                'reverse (so not objects). As its stands right now it also',
                'looks like you have more ' + str1 + ' than ' + str2 + '.',
                'So what I will do to save you from a nasty stylus error',
                'is omit the following ' + str2 + ':-> ' + objs.join(', ') + '.',
                'You will need to fix this otherwise this error messeage will',
                'keep yelling at you.'].join(' ');
      };
      if (objType.obj.length > objType.nonObj.length) {
        throwErr({
          type: 'Format',
          msg: errMsg(objType.nonObj, 'objects', 'non-objects'),
          code: data
        });
        isAllObjs = true;
        //remove error data
        data = _.omit(data, objType.nonObj);
      }else {
        throwErr({
          type: 'Format',
          msg: errMsg(objType.obj, 'non-objects', 'objects'),
          code: data
        });
        isAllObjs = false;
        //remove error data
        data = _.omit(data, objType.obj);
      }
    }

    //format data
    data = isAllObjs ? data : {[defaultKey]: data};

    return data;
  }
};

module.exports = util;
