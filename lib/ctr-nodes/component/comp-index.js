const _         = require('lodash');
const Immutable = require('immutable');
const teFlow    = require('te-flow');
const throwErr  = require('./comp-errors.js');
const _T        = require('../target/target-index.js');
const _M        = require('../manager/manager-index.js');
const _H        = require('../helpers/helper-index.js');

const processComp = function (_compKey, _data, _target) {

  /**
   * Formats the data so we are always working with an object
   * to keep all things the same.
   * @param  {obj} data   -> raw data obj
   * @param  {map} target -> target instance
   * @return {---}        -> formated data obj
   */
  const formatData = function (compKey, data, target) {
    let globalData;
    ({data, globalData} = _H.util.getGlobal(data));

    //plural container check, don't want to format if plural
    if (compKey !== 'components') {
      data = _H.util.formatData(data, compKey, {globalData});
    }

    return {
      data,
      target,
      globalData
    };
  };

  const configKey = function (data, target, globalData) {
    /**
     * Checks all the places where the user can define a element key
     * @param  {obj} val  -> indv data obj
     * @param  {str} key  -> the default key that will be used if the
     *                       user is using the obj notation method
     * @param  {str} find -> this funk will first search for the `element` key
     *                       if that is not found it will then check for `key`
     * @return {---}      -> confied key and data need be
     */
    const findKey = function (val, key = null, find = 'key') {

      //check for options
      if (val.option && val.option[find]) {
        key = val.option[find];
        val.option = _.omit(val.option, find);
      }else if (val[find]) {
        key = val[find];
        val = _.omit(val, find);
      }else if (key && key.match(/(^comp-|^component-)/gi)) {
        //assume heiphen shorthand
        key = key.match(/-(.*)/)[1];
      }else if (find === 'key' || find === 'selector') {
        //element not found so just alias of key
        return findKey(val, key, 'componentKey');
      }else if (key && key.match(/(^comp)/gi)) {
        key = 'componentNotFound';
        throwErr('noKey', {[key]: val});
      }

      return {
        val,
        key
      };
    };

    //Create a new map based on the data
    const dataMap = _.reduce(data, function (map, val, key) {

      //config/merge global data if present
      val = !globalData ? val : _H.util.mergeGlobal({val, key, globalData});

      //find key
      ({val, key} = findKey(val, key));

      //check to see if key is an array
      if (_.isArray(key)) {
        //since it has multiple keys we want to process each one
        //speratly so we will throw it back into the funk
        _.forEach(key, function (compKey) {
          processComp(compKey, _.cloneDeep(val), target);
        });
      }else {
        //seperate option from data
        let option;
        ({data: val, option} = _H.util.getOption(val));
        //config selector
        let selector = ' > ';

        //check for selector in the root
        let rootSelector = null;
        ({val, key: rootSelector} = findKey(val, null, 'selector'));
        if (rootSelector) {
          selector = rootSelector.length <= 1 ? (' ' + rootSelector + ' ') : rootSelector;
        }

        //check for false selector
        if (val.selector === false) {
          selector = ' ';
          val = _.omit(val, 'selector');
        }

        //check for overrides
        if (option) {
          //selector
          selector = !_.isUndefined(option.selector) ? option.selector : selector;
          //need to add some space for the people
          selector = selector.length <= 1 ? (' ' + selector + ' ') : selector;

          //appendKey option
          if (option.appendKey) {
            selector = '';
          }else if (selector === false) {
            //if false assume none, as in empty space
            selector = ' ';
          }else if (key.startsWith('-')) {
            // shorthand syntax -> comp--<key>
            selector = '';
            key = key.substr(1);
          }
        }
        //remove extra spaces
        selector = selector.replace(/\s{2,}/gm, ' ');

        //add internal key for ref, as of right now only used in
        //global state option but there are other potentail uses
        option = _H.util.merge(option, {
          _key: key,
          _selector: selector
        });

        //construct key
        key = selector + key;

        //only process if not array
        const compId = _H.util._id.gen('component');

        map = map.set(compId, Immutable.fromJS({
          key: key,
          data: val,
          option: option,
          type: 'component',
          id: compId
        }));
      }

      return map;
    }, Immutable.Map());

    //kill if dataMap is empty, means user used in array for elm key
    if (!dataMap.size) {
      return {
        _kill: true
      };
    }

    return {
      dataMap,
      target
    };
  };

  /**
   * Configs the target with any aux options and set not specific options
   * @param  {map} dataMap -> map made up of not objs
   * @return {map}         -> map with target updated
   */
  const wrapMap = function (dataMap, target) {
    dataMap = _T.wrap.set(dataMap, target);
    return {
      dataMap
    };
  };


  /**
   * Adds the config data into the queue to be processed
   * @param  {map} dataMap -> map made up of not objs
   * @return {---}         -> none adds to the queue
   */
  const queue = function (dataMap) {
    dataMap.forEach(function (valMap) {
      //add to queue
      _M._queue.add(valMap);
    });
  };

  return teFlow.call({
    args: {
      compKey: _compKey,
      data: _data,
      target: _target
    }},
    formatData,
    configKey,
    wrapMap,
    queue
  );
};

module.exports = processComp;
