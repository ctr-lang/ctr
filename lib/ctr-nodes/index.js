const styl         = require('stylus');
const Nodes        = styl.nodes;
const _            = require('lodash');
const teFlow       = require('te-flow');
const defclass     = require('defclass');
const Immutable    = require('immutable');
const IndexMgr     = require('./index-manager.js');
const renderStyle  = require('./index-render.js');
const _H           = require('./helpers/helper-index.js');
const _T           = require('./target/target-index.js');
const _M           = require('./manager/manager-index.js');
const convert      = require('./convert/convert-index.js');
const processTrans = require('./global/global-trans.js');
const processAnim  = require('./global/global-anim.js');
const processState = require('./state/state-index.js');
const processElm   = require('./element/element-index.js');
const processComp  = require('./component/comp-index.js');
const processMedia = require('./media/media-index.js');
const processGrid  = require('./grid/grid-index.js');
const processAttr  = require('./attribute/attribute-index.js');


const Ctr = defclass({
  constructor: function (stylus, data, selector, id, option) {
    const self = this;
    //sets global error var, which is set to true if an error is thrown
    //it is then picked up in ctr.js to let us know we should not catch the res
    global._ctrNodeError_ = false;

    /*-----------------------------*/
    /// Inital stylus var setup
    /*-----------------------------*/
    //The data which we will be using to create the css, this data it converted
    //from stylus to a js object in `ctr.js`, the most important puzzle piece
    self.data = data;
    //Block to which we will push all the renderd stylus to and then
    //return, the second most important puzzle piece
    _M._block = new Nodes.Block();

    //stylus ref for lookup calls and the like
    _M._stylus = stylus;

    /*-----------------------------*/
    /// Create Managers
    /*-----------------------------*/
    //options defined in stylus under the `$ctr_option` key
    let ctrOption = _M._stylus.lookup('$ctr-option');
    //@dep -> look up old noation
    if (!ctrOption) {
      ctrOption = _M._stylus.lookup('$ctr_option');
    }
    //convert if needed
    ctrOption = ctrOption ? convert.toJavascript.call(self, ctrOption) : false;
    //gen options
    _M._option = new _M.OptionManager(ctrOption, option);


    /*-----------------------------*/
    /// Config/set Options
    /*-----------------------------*/
    //declaritive
    if (selector !== '__ctrImparative__') {
      self.selector = selector;
      _M._option.setIn(['inheritSelector'], false);
    }else {
      //imparative
      //`ctrImparative` is to keep our thoughts in check and then we will
      //convert back to an empty string once we are appliing the data
      self.selector = '__ctrImparative__';
      _M._option.setIn(['inheritSelector'], true);
    }
    //set selector
    _M._option.setIn(['selector'], self.selector);

    //check local options
    if (_M._option.getIn(['global', 'checkLocally'])) {
      //wrapper for bellow each loop
      const mergeOption = function (val, key) {
        const optVal = _M._option.getIn(key);
        //check for init key match
        if (optVal !== null) {
          if (_.isObject(optVal)) {
            //merge in option to the defaults
            _M._option.mergeIn(key, _.defaultsDeep(val, _M._option.getIn(key)));
          }else {
            //merge in option to the defaults
            _M._option.mergeIn(key, val);
          }
        }
      };

      //wrapper for set option
      const setOption = function (optionObj) {
        //@hacky fix for #388
        if (_.hasIn(optionObj, ['transitionDefault'])) {
          _M._option.updateTransDefault(optionObj.transitionDefault);
          delete optionObj.transitionDefault;
        }
        //cycle to check if it option object has any global opts
        _.each(optionObj, function (val, key) {
          //if sub-object
          if (_.isObject(val)) {
            _.each(val, function (_val, _key) {
              mergeOption(_val, [key, _key]);
            });
          }else {
            mergeOption(val, [key]);
          }
        });
      };

      //set global option if one is present from js call
      if (_.isPlainObject(option) && !_.isEmpty(option)) {
        setOption(option);
      }

      //set local option object in data struc
      if (_.has(self.data, 'option')) {
        setOption(_.get(self.data, 'option'));
      }
      _.forEach(['$ctr-option', 'ctrOption'], function (val) {
        if (_.has(self.data, val)) {
          setOption(_.get(self.data, '$ctr-option'));
          self.data = _.omit(self.data, '$ctr-option');
        }
      });

    }

    //error reffrence
    _M._option.setIn(['errRef'], {
      id: selector,
      error: _M._option.getIn(['global', 'errorSuppress'])
    });


    /*-----------------------------*/
    /// Set default style is specifed
    /*-----------------------------*/
    //Check if buttron === true for defaults
    if (self.data.buttron || self.data.style) {
      self.data = _H.styleDefault(self.data);
    }

    //to process or not to process
    self.processStyle = _M._option.getIn(['global', 'processStyle']);

    //infinite loop saftey catch
    self.processedObjArg = null;
    //init run
    self.initRun = true;

    //Create stylus manager -> My main manager handle/store all the data
    self.indexMgr = new IndexMgr();

    //queue Manager
    _M._queue = new _M.QueueManager(self, {
      processStyle: self.processStyle,
      processBy: _M._option.getIn(['global', 'processBy']),
      processMedia: _M._option.getIn(['global', 'processMedia']),
      processTimeline: _M._option.getIn(['global', 'processTimeline']),
      queueMedia: _M._option.getIn(['global', 'queueMedia']),
      queueAnimation: _M._option.getIn(['global', 'queueAnimation'])
    });
    self.initIndex = null;
  },

  /**
   * The heart of CTR, throbbing you.
   * Dispatches, composes, and manages -> it's our main man (or woman)
   * @param  {obj}  _data       -> raw data context
   * @param  {map}  _target     -> current target context
   * @return {---}              -> inkoves `renderStyle`
   */
  extractStyle: function (_data, _target, type = 'style') {
    const self = this;

    //config data
    const configData = function(data, target) {
      //Keys which we will exclude from the dataMap
      const excludeKeys = self.initRun ? [] : ['option', 'query', 'shorthand', 'mixin'];
      self.initRun = false;
      //data map struc to be popultated
      const emptyDataMap = Immutable.Map({
        static: Immutable.OrderedMap(),
        obj: Immutable.OrderedMap()
      });

      //check for use keywork, if false we don't use the data
      data = self.doNotUse(data);
      if (!data) {
        return {
          emptyDataMap,
          target
        };
      }

      //we need to map out the raw objects into two maps, obj and staic
      const dataMap = _.reduce(data, function (map, val, key) {
        const addTo = _.isPlainObject(val) ? 'obj' : 'static';
        if (!_.includes(excludeKeys, key)) {
          return map.update(addTo, function (m) {
            return m.set(key, val);
          });
        }
        return map;
      }, emptyDataMap);

      return {
        dataMap,
        target
      };
    };

    //config target
    const configTarget = function(dataMap, target) {
      //set defualt is not present
      if (!target) {
        //set init selector values.

        target = Immutable.fromJS({
          selector: self.selector,
          selectorCar: '',
          selectorCdr: '',
          selectorMedia: ''
        });

        const indexId = _H.util._id.gen('index');
        self.initIndex = indexId;
        const data = dataMap.get('static');
        //pick up local option
        const option = dataMap.getIn(['obj', 'option']) || {};
        if (option) {
          dataMap = dataMap.deleteIn(['obj', 'option']);
        }

        target = _T.util.set(Immutable.fromJS({
          key: '',
          data: data,
          option: option,
          type: 'index',
          id: indexId
        }), target);
      }

      return {
        dataMap,
        target
      };
    };


    /**
     * The plan for this fn is to cycle through the various
     * components, and then merge and res of said comps
     */
    const composeData = function(dataMap, target) {
      //dataMap
      let staticArgs = dataMap.get('static');
      let objectArgs = dataMap.get('obj');

      //transform/matrix helpers are objs so we need to check and processes
      //them before seting static to keep source order
      if (objectArgs.size) {
        if (objectArgs.has('transform')) {
          ({staticArgs, objectArgs} = _H.helperKeys.transform(objectArgs, staticArgs));
        }else if (objectArgs.has('matrix')) {
          ({staticArgs, objectArgs} = _H.helperKeys.matrix(objectArgs, staticArgs));
        }
      }
      //check for filter, can be string/array/obj
      const filter = staticArgs.has('filter') || objectArgs.has('filter');
      if (filter) {
        ({staticArgs, objectArgs} = _H.helperKeys.filter(staticArgs, objectArgs));
      }

      //add static, as in non-obj key pairs
      if (staticArgs.size) {
        //check and process helpers if present
        staticArgs = _H.helperKeys.processHelperArgs(staticArgs, target);

        //hardcoded helper, kinds hacker tied to #396
        if (staticArgs.has('__inheritProps__')) {
          //remove
          staticArgs = staticArgs.delete('__inheritProps__');
        }

        if (type !== 'style' || self.processStyle) {
          //apply static args
          self.indexMgr.set(staticArgs, target);
        }
      }
      //deflate check due to helpers like font-size: responsive
      if (_M._queue.deflateQueue.size) {
        _M._queue.deflateNext();
      }

      /*
      If gate for the real fun;
       */
      if (objectArgs.size) {

        //infinite loop saftey catch set
        self.processedHash = objectArgs.hashCode();

        /**
         * So the gist of this funk is its a wrapper funk for the passed in args.
         * I would take a look at whats happening below in the loop to get a better
         * idea of whats going on but we are just passing the keyArgs into this funk
         * @param  {str}  key     -> Key from the objectArgs
         * @param  {str}  keyList -> the regex ref in the _H.util
         * @param  {str}  plural  -> The plural name which will then cycle through
         *                           the cylceCallFn
         * @param  {fn}  funk     -> The funk which we will invoke if it passes the
         *                           if gate
         * @param  {bln} passKey  -> If we need to pass the key to the funk
         * @return {---}          -> A whole shit load could happen but nothing
         *                           is returned directly
         */
        const keyCheck = function (key, keyType, funk, passKey = true) {
          //test from list, check out the util
          if (_H.util.regularExp.keyTest(key, keyType)) {
            //checks for use key
            const data = self.doNotUse(objectArgs.get(key), keyType);
            if (!data) { return true; }
            //send off to be processed
            if (passKey) {
              funk(key, data, target, keyType);
            }else {
              funk(data, target, keyType, key);
            }
            return true;
          }
        };

        // The gist here is to cycle though all the object keys
        // and then sub cycle the above key funks to see if
        // we have a regex match. If we have a match processes said match
        // and return true so we can bust the loop and move on
        const keyArgs = [
          //single, plural, function
          ['grid',       processGrid, false],
          ['transition', processTrans],
          ['animation',  processAnim],
          ['media',      processMedia, false],
          ['state',      processState],
          ['non',        processElm],
          ['element',    processElm],
          ['attribute',  processAttr],
          ['component',  processComp]
        ];

        const keyList = objectArgs.keys();
        //cycle through keys and inkove fns to match regex
        for (let key of keyList) {
          for (let f = 0; f < keyArgs.length; f++) {
            const keyArg = keyArgs[f];
            //add key to the front of the line
            keyArg.unshift(key);
            const fnRes = keyCheck.apply(null, keyArg);
            //remove the key from the front of the line
            keyArg.shift();
            if (fnRes) {
              //remove key
              objectArgs = objectArgs.delete(key);
              //bust loop
              f += keyArgs.length;
            }
          }
        }
      }

      /**
       * Deflate and tmpl features before moving onto the next cycle
       */
      if (_M._queue.deflateQueue.size) {
        _M._queue.deflateNext();
      }

      return {
        objectArgs,
        target
      };
    };

    //process data
    const processData = function(objectArgs, target) {
      //run till nothing left to process
      if (objectArgs.size) {
        //infinite loop saftey catch
        if (objectArgs.hashCode() !== self.processedHash) {
          //first check; so we try to extract style one more time
          //just to make sure before we throw an error
          self.extractStyle(objectArgs.toJS(), target);
        }else {
          _H.throwErr({
            type: 'Infinite Loop',
            code: JSON.stringify(objectArgs.toJS()),
            msg: ['Something does not belong and I can not process',
                  'the above object so rather than throwing a nasty',
                  'stylus error I will just remove it and tell you',
                  'to take care of it. So take care of it and fix it.'].join(' ')
          });
        }
      }


      /**
       * Processes, formats, and renders our CSS styles in the stack
       */
      if (target.get('stack').size === 1) {
        let queueDone = false;
        //while river
        while (queueDone !== true) {
          queueDone = _M._queue.next();
        }
        //formats and renders our styles via stylus
        if (self.indexMgr.stack.size) {
          renderStyle(self.indexMgr, false, target);
        }
      }

      //Final return for the whole show
      return;
    };

    /*-----------------------------*/
    /// Main Call
    /*-----------------------------*/
    return teFlow.call({
      args: {
        data: _data,
        target: _target
      }},
      configData,
      configTarget,
      composeData,
      processData
    );
  },

  /**
   * check for use/omit in objs @hacky as fuck, but an afterthought
   * @param  {obj}  data -> data at hand
   * @param  {key}  key  -> type of data
   * @return {---}       -> false || data
   */
  doNotUse: function (data, key = false) {
    const useIsFalse = function (obj) {
      return _.includes([false, 'false'], obj);
    };
    const useIsTrue = function (obj) {
      return _.includes([true, 'true'], obj);
    };

    //init data check
    if (!key) {
      const use = _.get(data, 'use');
      if(useIsFalse(use)) {
        return false;
      }else if (useIsTrue(use)) {
        //remove use from data
        return _.omit(data, 'use');
      }
    }


    //cycle check
    if (useIsFalse(_.get(data, 'use'))) {
      return false;
    }else if (useIsTrue(_.get(data, 'use'))) {
      data = _.omit(data, 'use');
    }

    //recurse check these, since there may be deeper options like tl to remove
    const searchObject = function (sourceObj) {
      //processing object - loop de loop
      for (const property in sourceObj) {
        if (sourceObj.hasOwnProperty(property)) {
          if (_.isPlainObject(sourceObj[property])) {
            const use = _.get(sourceObj[property], 'use');
            if (useIsFalse(use)) {
              sourceObj = _.omit(sourceObj, property);
            }else {
              if (useIsTrue(use)) {
                //removes ture ueses
                sourceObj[property] = _.omit(sourceObj[property], 'use');
              }
              sourceObj[property] = searchObject(sourceObj[property]);
            }
          }
        }
      }
      return sourceObj;
    };

    data = searchObject(data);

    return data;
  }
});


module.exports = function (data, selector, id, option) {
  //create
  const css = new Ctr(this, data, selector, id, option);
  //extract
  css.extractStyle(css.data);
  //return block or false if empty literal
  //we need to return something here otherwise stylus gets all confused
  return _M._block.nodes.length ? _M._block : new Nodes.Literal('');
};
