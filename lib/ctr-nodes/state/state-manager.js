const _         = require('lodash');
const teFlow    = require('te-flow');
const Immutable = require('immutable');
const defclass  = require('defclass');
const throwErr  = require('./state-errors.js');
const getPreset = require('../preset/preset-index.js');
const _T        = require('../target/target-index.js');
const _M        = require('../manager/manager-index.js');
const _H        = require('./../helpers/helper-index.js');

const StateManager = defclass({
  constructor: function (globalData) {
    const self = this;
    //stack to push data to
    self.stack = Immutable.List();
    //config global data
    globalData = self.configGlobalData(globalData);
    //set
    self.globalData         = globalData;
    self.globalDataCopy     = _.cloneDeep(globalData);
    self.globalDataFormate  = false;
    self.globalOption       = globalData.option || {};
    self.defaultTransOption = _M._option.getIn(['transitionDefault']);
  },

  /**
   * Configs the global data, placed opt props in the opt obj need be,
   * places shorthand in the option obj need be, and if no on/non
   * is specified configs the proper autoGen logic
   * @param  {obj} globalData -> the global data
   * @return {obj}            -> configed global data
   */
  configGlobalData: function (globalData) {
    //pull out globals in the common obj
    const optionPullKeys = ['duration', 'delay', 'ease', 'will-change'];
    globalData = _.reduce(globalData, function (prv, val, key) {
      if (_.includes(optionPullKeys, key)) {
        if (!prv.option) {
          prv.option = {[key]: val};
        }else if (!prv.option[key]) {
          prv.option[key] = val;
        }
        //remove from root
        _.unset(prv, key);
      }
      return prv;
    }, globalData);

    //place shorthand in option object need be
    if (_.has(globalData, 'shorthand')) {
      globalData.option = globalData.option ? globalData.option : {};
      globalData.option = _.defaultsDeep(globalData.option, {
        shorthand: globalData.shorthand
      });
      //remove now in option obj
      _.unset(globalData, 'shorthand');
    }

    //if no, on/non defined assumes to be global and place data in both
    // const onlyOption = _.size(globalData) === 1 && _.has(globalData, 'option');
    if (!_.has(globalData, 'on') && !_.has(globalData, 'non')) {
      //re-create
      globalData = {
        on: _.cloneDeep(globalData),
        //non is a bit tricky cus we assume autoGen and as such we want to
        //create non state transition but not include the raw props,
        //so we loop through and add raw props to shorthand
        non: _.reduce(globalData, function (prv, val, key) {
          if (!_.isPlainObject(val)) {
            if (!_.hasIn(prv, `option.shorthand.${key}`)) {
              _.set(prv, `option.shorthand.${key}`, true);
            }
            _.unset(prv, key);
          }
          return prv;
        }, globalData)
      };
    }

    //->
    return globalData;
  },

  /**
   * Finds and then configs the key from the state obj, this is where we
   * figure out if we are working with a special key like hover-board or customSt
   * @param  {obj} props    -> The props object which we may have to clean
   *                           depending on what the user want to use
   * @param  {str} stateKey -> The default state key
   * @param  {str} find     -> The finder key, it will either be state or key
   * @return {obj}          -> props and the stateKey
   */
  findStateKey: function (data, stateKey, find = 'key') {
    const self = this;
    if (data.option && data.option[find]) {
      stateKey = data.option[find];
      data.option = _.omit(data.option, find);
    }else if (data[find]) {
      stateKey = data[find];
      data = _.omit(data, find);
    }else if (stateKey.match(/^hover-|^focus-|^active-|^checked-|^link-|^visited-|^valid-|^required-|^out-of-range-|^optional-|^invalid-|^in-range-|^enabled-|^disabled-/i)) {
      //assume heiphen shorthand
      const stateWrap = stateKey.substr(stateKey.lastIndexOf('-'));
      stateKey = stateKey.replace(RegExp(stateWrap, 'g'), '');
      data = {[stateWrap.slice(1)]: data};
    }else if (find === 'key') {
      //element not found so just alias of key
      return self.findStateKey(data, stateKey, 'state');
    }else if (stateKey.match(/(^customSt|^states)/gi)) {
      stateKey = 'stateNotFound';
      throwErr('noKey', {[stateKey]: data});
    }

    return {
      data,
      stateKey
    };
  },

  /**
   * Gets preset if one is set
   * @param  {str} type    -> type either `on` or `non`
   * @param  {map} dataMap -> cur data
   * @return {map}         -> data with preset data merged
   */
  configPreset: function (type, dataMap) {
    if (dataMap.has('preset')) {
      const preset = getPreset('state', dataMap.get('preset'), {stateType: type});
      //delete preset
      dataMap = dataMap.delete('preset');
      if (preset) {
        //merge in data is preset found otherwise an error will be thrown
        dataMap = Immutable.fromJS(preset).mergeDeep(dataMap);
      }
    }
    return dataMap;
  },

  /**
   * Basically seperates the props into four cats: on, non, common, and static
   * so we can configure them as such
   * @param  {obj} props -> The object where the props be
   * @return {obj}       -> the formatedProps obj formated as I descirbed above
   */
  formatProps: function (dataMap) {
    const self = this;

    //check if only static
    const isOnlyStatic = dataMap.size === 1 && dataMap.has('static');

    //if only static no need to process further return
    if (isOnlyStatic) {
      const staticData = dataMap.get('static');
      return Immutable.fromJS({
        on: {static: staticData},
        non: {static: staticData}
      });
    }

    /**
     * helper to add shorthand into option need be
     */
    const shortToOption = function (map) {
      //if it has shortahdn
      if (map.has('shorthand')) {
        //set and delet
        const shorthand = map.get('shorthand');
        map = map.delete('shorthand');
        //set option if none
        if (map.has('option')) {
          //update option with shorthand
          return map.update('option', function (_map) {
            return _H.util.setOrMerge('shorthand', _map, shorthand);
          });
        }
        //no option present
        return map.set('option', Immutable.fromJS({
          shorthand: shorthand
        }));
      }
      return map;
    };

    //cycle to assign keys
    const hasOn     = dataMap.has('on');
    const hasNon    = dataMap.has('non');
    const hasStatic = dataMap.has('static');
    const hasCommon = dataMap.has('common');
    //to generate non
    const genNon = !hasNon && !hasCommon && !dataMap.has('preset');

    //pre-format shorthand need be
    dataMap = shortToOption(dataMap);

    //init
    let onData = null;
    let nonData = null;

    //on assumption check
    if (!hasOn && !hasNon && !hasStatic && !hasCommon) {
      //we are assuming the user wishes for us to gen non for them
      //and the entire object is the base on
      onData = dataMap;
      nonData = dataMap;
    }else {
      //set init on
      if (hasOn) {
        onData = shortToOption(dataMap.get('on'));
      }else {
        onData = Immutable.Map();
      }

      //set init non
      if (hasNon) {
        nonData = shortToOption(dataMap.get('non'));
      }else {
        nonData = Immutable.Map();
      }

      //common check
      if (dataMap.has('common')) {

        //remove any global keys, alreayd merged in cunstructor
        _.forEach(['duration', 'delay', 'ease', 'will-change'], function (pullKey) {
          if (dataMap.hasIn(['common', pullKey])) {
            dataMap = dataMap.deleteIn(['common', pullKey]);
          }
        });

        const common = shortToOption(dataMap.get('common'));
        //merege into both
        onData = common.mergeDeep(onData);
        nonData = common.mergeDeep(nonData);
      }

      //static check
      if (dataMap.has('static')) {
        //add static to both
        onData = _H.util.setOrMerge('static', onData, dataMap);
        nonData = _H.util.setOrMerge('static', nonData, dataMap);
      }
    }

    //config presets
    if (onData.size) {
      onData = self.configPreset('on', onData);
    }
    if (nonData.size) {
      nonData = self.configPreset('non', nonData);
    }

    //global option check
    if (dataMap.has('option')) {
      //merge in option into on and non if there is a localized option val
      if (onData.size) {
        onData = _H.util.setOrMerge('option', onData, dataMap);
      }
      if (nonData.size) {
        nonData = _H.util.setOrMerge('option', nonData, dataMap);
      }
    }

    //GenNon means we have to generate a non for the user since the
    //user did not specifiy a `on` or 'non' obj, this gets a bit hairy
    //at times, but the basic gist is that we need to remove all props
    //from the non object and just keep the trans props.
    const noGlobalNon = _.has(self.globalDataCopy, 'non')
                      && _.isEmpty(_.omit(_.get(self.globalDataCopy, 'non'), 'option'));
    if (genNon && noGlobalNon) {
      if (nonData.has('option')) {
        nonData = nonData.update('option', function (map) {
          return map.set('_nonGen', true);
        });
      }else {
        nonData = nonData.set('option', Immutable.Map({_nonGen: true}));
      }
    }else if (genNon && !noGlobalNon) {
      //If we get here it means we are autoGen'in but there is also non
      //global data, so we have to work around the data, and merge in global
      //and all non props to shorthand. It's how I should have handled this
      //whole pipeline but its to late not @future
      const nonProps = nonData.filter(function (val) {
        if (!val.size) {
          return true;
        }
      });
      //loop props to add them to the shorthand so that they gen trans props
      _.forEach(nonProps.toJS(), function (val, key) {
        if (!nonData.hasIn(['option', 'shorthand', key])) {
          nonData = nonData.setIn(['option', 'shorthand', key], true);
        }
        nonData = nonData.delete(key);
      });

    }

    //combin non and on and return
    return Immutable.Map({
      on: onData,
      non: nonData
    });
  },

  /**
   * Configures the globals which are trans and anim the reason we need this is
   * for two reasons. First depending on the anim we may have to process it
   * seperatly
   */
  configGlobals: function (data, stateKey, target) {
    //Process animation
    ({data} = _H.findKey(data, ['anim', 'animation'], {
      processAnim: true,
      addToStatic: true,
      //so this is here cus if there is a animation with diffrent
      //target opts like applyTo, we got to do a little bit of a walk around
      //depth of one is really, really, @important
      target: target,
      data: data,
      key: stateKey,
      type: 'state',
      depth: 1
    }));

    //Pull out any tran/transition sub objs and place in parent, the depth
    //is really, really @important here due to the transition option prop
    ({data} = _H.findKey(data, ['trans', 'transition'], {
      moveGlobal: true,
      depth: 2
    }));

    return {
      data
    };
  },

   /**
    * This guy just wants to make sure we have the right options
    * so we don't look like a fool in front of all our peers.
    * @param  {map} dataMap   -> that data map
    * @param  {str} key       -> key like `hover`
    * @param  {str} stateType -> on or non
    * @return {map}           -> configed
    */
  configOption: function (dataMap, key, stateType) {
    const self = this;

    //set type if defined internally
    stateType = stateType === '_on'  ? 'on'  : stateType;
    stateType = stateType === '_non' ? 'non' : stateType;

    //get/set optiong
    const transOption      = self.defaultTransOption;
    let stateTransOption = _M._option.getIn([key]);

    stateTransOption = !stateTransOption
                       ? transOption.default
                       : stateTransOption;
    //set inital option
    dataMap = dataMap.has('option') ? dataMap : dataMap.set('option', Immutable.Map());

    //config Key append to need
    let keyOption = dataMap.get('option').toJS();
    ({key, option: keyOption} = _H.util.configPseudoKey(key, keyOption));

    //update option
    dataMap = dataMap.update('option', function (map) {
      return map.withMutations(function (_map) {
        return _map
                //tack on defaults for ref
               .set('_default', Immutable.fromJS(stateTransOption))
                //add type and key
               .set('_stateType', stateType)
               .set('_stateKey', key)
               //internal appendTo from keyoption
               .set('_appendTo', keyOption._appendTo);
      });
    });

    return dataMap;
  },

  /*
  Set
   */
  set: function (_data, _stateKey, _target) {
    const self = this;

    const configData = function (data, stateKey, target) {
      //if true data inherits globaldata
      data = data === true ? _.cloneDeep(self.globalData) : data;

      //find/assign key
      ({data, stateKey} = self.findStateKey(data, stateKey));


      //handles multiple states if stateKey is a array
      if (_.isArray(stateKey)) {
        _.forEach(stateKey, function (key) {
          self.set(data, key, target);
        });
        return {
          _kill: true
        };
      }

      //pull out trans and extract and congig and anim
      ({data} = self.configGlobals(data, stateKey, target));

      //if no data to be processed kill
      if (data === false || _.isEmpty(data)) {
        return {
          _kill: true
        };
      }

      //convet both data + global into repective objs, on/non/static
      self.globalData = self.globalDataFormate
                      ? self.globalData
                      : self.formatProps(Immutable.fromJS(self.globalData));
      self.globalDataFormate = true;
      //conver to imut to avodie side effects
      let dataMap = Immutable.fromJS(data);
      dataMap = self.formatProps(dataMap);

      //config/merge global data if present
      //to merge in the global data we need to loop the keys becuase
      //we have to drill down to an indv level to get acsess to the option
      //obj so we can check opt props like omit or pick
      self.globalData.forEach(function (val, key) {
        dataMap = dataMap.updateIn([key], function (map) {
          return map ? Immutable.fromJS(_H.util.mergeGlobal({
            val: map.toJS(),
            //need to use original key here cus stateKey is reassinged
            key: _stateKey,
            globalData: val.toJS(),
            context: key
          })) : map;
        });
      });

      //check on/non values and if the state is in the stateOmitList we need
      //add autoGen: false so that trans props are not generated
      _.forEach(['on', 'non'], function (val) {
        if (!dataMap.hasIn([val, 'option', 'autoGen'])) {
          dataMap = dataMap.setIn(
            [val, 'option', 'autoGen'],
            !_.includes(_M._option.getIn(['global', 'stateOmitList']), stateKey)
          );
        }
      });

      return {
        dataMap,
        stateKey,
        target
      };
    };


    const formatData = function (dataMap, stateKey, target) {
      const composeData = function (_dataMap) {
        //reduce and re-use
        return _dataMap.reduce(function (map, val, stateType) {
          let setData = false;
          //update state type with configed options
          map = map.update(stateType, function (_map) {
            //check for static option data, if so assum target option
            const hasStaticOption = _map.hasIn(['static', 'option']);
            //this may be a bit silly but there are use cases for this
            //whole static work around
            if (hasStaticOption && _map.size === 1) {
              //is comprised up of only static obj all we need to do is
              //pull out the options
              _map = _map.set('option', _map.getIn(['static', 'option']));
            }else if (hasStaticOption) {
              //this is the tricky bit, if it get here we have to process static
              //seperatly so we throw it back into to mix. At the end of the day
              //this is sorta silly, and sorta a mind melt but fuck it, I'm
              //keeping it for right now cause it has some usecases

              //get static data
              const staticData = _map.get('static');
              //delete the data from map
              _map = _map.delete('static');
              //prefix key as to not override state which already exisits
              const stateTypePrefix = '_' + stateType;
              //compose new data struc
              const composedStaticData = Immutable.fromJS({
                [stateTypePrefix]: {
                  static: staticData
                }
              });
              //populate statData which will resubmit the staticData
              setData = composedStaticData;
            }
            //config options
            return self.configOption(_map, stateKey, stateType);
          });

          if (setData) {
            //merge in if the internal set data
            return map.merge(composeData(setData));
          }

          return map;
        }, _dataMap);
      };

      //we assigning via a funk so we can pull off some recusive bullshit if needed
      dataMap = composeData(dataMap);

      return {
        dataMap,
        target
      };
    };


    const setStack = function (dataMap, target) {
      //clycle dataMap to add to stack
      dataMap.forEach(function (valMap) {
        //seperate option from dataMap
        const option = valMap.get('option');
        valMap = valMap.delete('option');
        const stateKey = option.get('_stateKey');
        const stateId = _H.util._id.gen('state');
        const map = Immutable.fromJS({
          key: stateKey,
          data: valMap,
          option: option,
          type: 'state',
          id: stateId
        });
        //set target
        const targetCopy = target;
        dataMap = dataMap.set('target',
          _T.util.set(map, targetCopy)
        );
        //add to stack
        self.stack = self.stack.push(dataMap.get('target'));

      });
    };


    teFlow.call({
      args: {
        data: _data,
        stateKey: _stateKey,
        target: _target
      }},
      configData,
      formatData,
      setStack
    );

  },
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

module.exports = StateManager;
