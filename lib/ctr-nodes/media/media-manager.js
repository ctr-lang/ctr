const _           = require('lodash');
const Immutable   = require('immutable');
const defclass    = require('defclass');
const teFlow      = require('te-flow');
const throwErr    = require('./media-errors.js');
const mediaMixin  = require('./media-mixin-config.js');
const _T          = require('../target/target-index.js');
const _M          = require('../manager/manager-index.js');
const _H          = require('../helpers/helper-index.js');

/*
The heart of the media monseter.
 */
const MediaManager = defclass({
  constructor: function (globalData) {
    const self = this;
    self.stack = Immutable.List();

    //set refs
    self.mediaQBreakPoints = _M._option.getIn(['media']);
    self.globalData = globalData;
    self.mixinTypes = ['above', 'from-width', 'below', 'to-width', 'landscape',
                      'portrait', 'density', 'between', 'at'];
  },
  /**
   * Basic check to make sure there is media data for us to work with
   * @param  {obj} data -> raw data obj
   * @return {obj}      -> data obj or empty obj as to not throw err
   */
  mediaCheck: function (data) {
    if (!_.isObject(data.query) && !data.type && !data.mixin) {
      //string shorthand
      if (_.isString(data.query)) {
        return _H.util.merge(data, {query: {at: data.query}}, true);
      }
      const addOn = data.option
      ? [' !! Note !!, it looks like you have a option object so my guess is',
         'you just need/want to change "option" to "query".'] : [];
      throwErr('format', {
        code: {media: data},
        msg: ['It looks I have nothing to work with in your media object.',
              'You need to have either a query object, or a type',
              'key/value, or a mixin key/vale, but your have none of these',
              'so I cant make magic.'].join(' ') + addOn.join(' ')
      });
      return {};
    }
    return data;
  },
  /**
   * This buddy will extract and compose the mixin
   * @param  {obj} mixin -> the mixin obj
   * @return {obj}       -> configed mixin obj
   */
  processMixin: function (mixin) {
    const self = this;
    if (_.isObject(mixin)) {
      //since mixins are in obj form we need to reduce to
      //extract the contents and such
      const mixinRes =  _.reduce(mixin, function (mPrv, mVal, mType) {
        //Extract/config mixin
        //note the keys from mixRes will be fet and val
        const mixRes = mediaMixin(mType, mVal, self.mediaQBreakPoints);
        if (_.isArray(mixRes)) {
          //array from at, since it is in arr form need
          //to reduce to add to obj
          mPrv = _.reduce(mixRes, function (prv, val) {
            prv[val.fet] = val.val;
            return prv;
          }, mPrv);
        }else {
          //default
          mPrv[mixRes.fet] = mixRes.val;
        }
        //remove mixin key
        mPrv = _.omit(mPrv, mType);
        return mPrv;
      }, mixin);

      return mixinRes;
    }
  },
  /**
   * Process the type of media q, as in if its `not tv`
   * It will go ahead and create that string
   * @param  {arr} type -> media type as in `screen`
   * @param  {str} cond -> the condition can be `only` or `not`
   * @return {str}      -> composed string
   */
  processType: function (type, cond = 'only') {
    //default condition
    if (_.isString(cond)) {
      //compose string
      return _.reduce(type, function (str, key, index, list) {
        str += ' ' + key + (index < (list.length - 1)  ? ', ' : '');
        return str;
      }, cond);
    }
    //only can take strings
    throwErr('syntax', {
      exp: 'String',
      rec: typeof cond,
      code: cond,
      msg: 'If you do not fix this I will just ignore it.'
    });
  },
  /**
   * This is the heart of creating the media query. It will take the raw data
   * to see what we are working with and based on that config it properly
   * so it then can be composed latter on.
   * @param  {obj} data  -> The raw data object including props and such
   * @param  {obj} query -> This dependant, it will either be the same as
   *                        the `data` obj or the acutall query object
   * @return {obj}       -> With the query type and its various queries
   */
  configQuery: function (_data, _query) {
    const self = this;
    /**
     * Wrapper funk to find said val
     * @param  {str} val -> Either `type` or `mixin`
     * @return {---}     -> A value or nothing
     */
    const findVal =  function (query, data, val) {
      if (query[val]) {
        return query[val];
      }else if (data[val]) {
        return data[val];
      }else if (data.query && data.query[val]) {
        return data.query[val];
      }
    };

    /*
    Config Type, as in the 'only screen'
     */
    const configType = function (data, query) {
      let qType = findVal(query, data, 'type') || {};
      //singele string shorthand formate
      if (_.isString(qType) || _.isArray(qType)) {
        const typeRegex = /(only|not)/g;
        //ensure users know what the fuck they are doing
        const hasCond = typeRegex.test(query.type);
        //use array or make one
        const queryType = _.isArray(query.type) ? query.type : [query.type];
        query.type = hasCond
                     ? query.type
                     : self.processType(queryType);
        //reassing
        qType = query.type;
      }else {

        //format media q
        qType.media = _.isString(qType.media) ? [qType.media] : qType.media;
        if (!qType.media || !qType.media.length) {
          //set default if none
          //Decided to set the default to none. It possibly might
          //be adventagous to set the default to `only screen` but
          //fuck it we can't hold evertyones hand
          qType = '';
        }else {
          //send off to be processed
          qType = self.processType(qType.media, qType.cond || qType.condition);
        }
      }
      //remove type from query obj
      query = _.omit(query, 'type');

      return {
        data,
        query,
        qType
      };
    };

    /*
    Config Mixin
     */
    const configMixin = function (data, query, qType) {
      let mixin = findVal(query, data, 'mixin') || {};
      //check for device: true option, and remove if so
      const deviceMinMax = query.device || mixin.device || false;
      //need to remove decive opt if present
      if (deviceMinMax) {
        if (query.device) {
          query = _.omit(query, 'device');
        }else if (mixin.device) {
          mixin = _.omit(mixin, 'device');
        }
      }
      //process mixin vals
      if (!_.isString(mixin)) {
        //cycle to check if any mixin types in query and reassing
        mixin = _.reduce(query, function (prv, val, key) {
          const keyApp = key.match(/___\d/);
          if (_.includes(self.mixinTypes, keyApp ? key.replace(/___\d/, '') : key)) {
            prv[key] = val;
            query = _.omit(query, key);
          }
          return prv;
        }, mixin);

        const mixinRes = self.processMixin(mixin);

        //config/process mixin and add res into prvQ as keys
        query = _.reduce(mixinRes, function (prv, val, key) {
          prv[key] = val;
          return prv;
        }, _.omit(query, 'mixin'));
      }else {
        //throw err and ignore not obj
        throwErr('syntax', {
          exp: 'Object',
          rec: typeof mxin,
          code: {mixin: mixin},
          msg: 'If you do not fix this I will just ignore it.'
        });
      }

      return {
        data,
        query,
        qType,
        deviceMinMax
      };
    };

    const configKey = function (data, query, qType, deviceMinMax) {
      /**
       * Wrapper funk for prefixing the key
       * @return {obj}        -> With new key if matched and old key removed
       */
      const preFixKey = function (key, val, keyFor, newKey, qObj) {
        if (key === keyFor) {
          //add/remove keys
          qObj[newKey] = val;
          qObj = _.omit(qObj, keyFor);
        }
        return qObj;
      };

      /*
      Config query val, that is check to see if any the query values
      are referencing the default stylus media qs
       */
      const mediaQBps = self.mediaQBreakPoints;
      query = _.reduce(query, function (prv, val, key) {
        val = mediaQBps[val] || val;
        //if deviceMinMax prefix
        if (deviceMinMax) {
          prv = preFixKey(key, val, 'min-width', 'min-device-width', prv);
          prv = preFixKey(key, val, 'max-width', 'max-device-width', prv);
          prv = preFixKey(key, val, 'min-height', 'min-device-height', prv);
          prv = preFixKey(key, val, 'max-height', 'max-device-height', prv);
        }else {
          prv[key] = val;
        }
        return prv;
      }, query);

      return {
        query,
        qType
      };
    };

    return teFlow.call({
      args: {
        data: _data,
        query: _query
      }},
      configType,
      configMixin,
      configKey, {
        return: function (query, qType) {
          return {
            query,
            //@todo use full name
            queryType: qType
          };
        }
      }
    );
  },


  /**
   * Checks for helps, well for the one helper retina, an after thought,
   * so poorish placement
   */
  queryHelpers: function (query) {
    //check and config retina
    if (_.get(query, 'retina')) {
      const orKey = _.has(query, 'orCond') ? 'orCond' : 'orCondition';
      query = _.omit(query, 'retina');
      query = _.defaultsDeep(query, {
        [orKey]: {
          '-webkit-min-device-pixel-ratio': '2',
          'min-resolution': '192dpi'
        }
      });
    }
    return query;
  },


  /**
   * Pulls out the query and its various types depending on struc
   * @param  {obj} query -> the query object to look in
   * @param  {str} type  -> the query key we assin
   * @param  {arr} keys  -> the list of keys to look under
   * @return {obj}       -> our findings
   */
  findQuery: function (query, type, keys) {
    const self = this;
    const typeOption = query.type;
    //query scoped from above and look to find a condition
    return _.reduce(keys, function (prv, qVal) {
      let cond = query[qVal];
      if (cond) {
        //remove from query
        prv.query = _.omit(prv.query, qVal);

        //@todo util
        //formate, to make and obj with an key otherwise
        //it on obj composed of objs so we leave it as such
        cond = _.every(cond, function (_val, _key) {
          if (_key !== 'mixin') {
            return _.isObject(_val);
          }
        }) ? cond : {[type]: cond};

        //if typeOption we need to inject into the condition
        if (typeOption) {
          cond[type].type = typeOption;
          prv.query = _.omit(prv.query, 'type');
        }

        //cycle and compose
        prv[type] = _.reduce(cond, function (_prv, _val) {
          _prv.push(self.configQuery(_val, _val));
          return _prv;
        }, prv[type]);
      }

      return prv;
    }, {[type]: [], query});
  },

  /**
   * This will set the query data into the managers map. But before it can do
   * so it will do a precheck and a preconfig and then send it off to `configQuery`
   * to be configed so it can be composed latter on.
   * @param {obj} data -> The raw media data object
   */
  set: function (_data, _key, _target) {
    const self = this;

    const format = function (data, key, target) {
      //precheck for formating
      data = self.mediaCheck(data);

      //config/merge global data if present
      data = !self.globalData
           ? data
           : _H.util.mergeGlobal({val: data, key, globalData: self.globalData});

      //pull out query
      let query = _.get(data, 'query') || {};
      data = _.omit(data, 'query');

      //check for any query helpers
      query = self.queryHelpers(query);

      /**
       * Converts array values to obj key/value to be processed
       * max-width === max-width__1
       */
      const arrToProps = function (_query) {
        return _.reduce(_query, function (prv, val, _k) {
          const typeKey = _.includes(['type', 'media', 'between'], _k);
          if (!typeKey && _.isArray(val)) {
            //prefixes keys prop___i = val
            for (let i = 0; i < val.length; i++) {
              prv[`${_k}___${i}`] = val[i];
            }
          }else if (_.isPlainObject(val)) {
            prv[_k] = arrToProps(val);
          }else {
            prv[_k] = val;
          }
          return prv;
        }, {});
      };
      query = arrToProps(query);

      return {
        data,
        query,
        target
      };
    };

    const config = function (data, query, target) {
      // -> so the reson is cus `or` is a key word
      // - OR, _or, 0r, ors not that fucking importaint
      //check for or query and config if so
      let andQuery;
      ({andQuery, query} = self.findQuery(query, 'andQuery', ['andCond', 'andCondition']));

      let orQuery;
      ({orQuery, query} = self.findQuery(query, 'orQuery', ['orCond', 'orCondition']));

      if (!andQuery.length) {
        //assume that the entire obj is an `and condition`
        //and we then configure the object as such although we only want
        //to config the global shit so we omit `or conditions` need be
        andQuery.push(self.configQuery(data, query));
      }else if (!_.isEmpty(query)) {
        //check query length as to delegate any left overs
        query = {andCond: query};
        andQuery.push(...self.findQuery(query, 'andQuery', ['andCond']).andQuery);
      }

      //re-assing query
      query = {
        andQuery: andQuery,
        orQuery: orQuery
      };

      return {
        data,
        query,
        target
      };
    };

    const setStack = function (data, query, target) {

      //seperate optiojn from data
      let option;
      ({data, option} = _H.util.getOption(data));

      //merge in option and query
      option = _H.util.merge(query, option);

      const mediaId = _H.util._id.gen('media');
      let dataMap = Immutable.fromJS({
        key: '',
        data: data,
        option: option,
        type: 'media',
        id: mediaId
      });

      //set wrap
      dataMap = _T.wrap.setStack(dataMap, target, {
        setInTarget: true
      });

      //add to stack if we are processing
      if (dataMap.getIn(['target', 'media']).last().get('process')) {
        self.stack = self.stack.push(dataMap.get('target'));
      }
    };

    teFlow.call({
      args: {
        data: _data,
        key: _key,
        target: _target
      }},
      format,
      config,
      setStack
    );
  },

  /**
   * Gets the next value in the map
   * @return {obj} -> {data, andQuery, orQuery}
   */
  next: function () {
    const self = this;
    //nothing left
    if (!self.stack.size) { return false; }
    //get target in line
    const target = self.stack.first();
    //remove from stack
    self.stack = self.stack.shift();

    return target;
  }
});

module.exports = MediaManager;
