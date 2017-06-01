const _         = require('lodash');
const teFlow    = require('te-flow');
const Immutable = require('immutable');
const moduleGet = require('./module/module-index.js');
const famHelp   = require('./module/family-helper.js');
const _T        = require('../target/target-index.js');
const _M        = require('../manager/manager-index.js');
const _H        = require('../helpers/helper-index.js');

const processElement = function (_elmKey, _data, _target, _elmType) {

  /**
   * Formats the data so we are always working with an object
   * to keep all things the same.
   * @param  {str} elmKey  -> obj key
   * @param  {obj} data    -> raw data obj
   * @param  {map} target  -> target instance
   * @param  {str} elmType -> 'element' | 'non'
   * @return {---}        -> formated data obj
   */
  const format = function (elmKey, data, target, elmType) {
    let globalData;
    ({data, globalData} = _H.util.getGlobal(data));

    //plural container check, don't want to format if plural
    if (!_H.util.regularExp.pluralTest(elmKey, elmType)) {
      data = _H.util.formatData(data, elmKey, {globalData});
    }

    return {
      data,
      target,
      globalData,
      elmType
    };
  };

  /**
   * Finds/configs the element key the user wished to use
   * @param  {obj} data   -> formated data obj
   * @param  {map} target -> target instance
   * @return {map}        -> A map with the element as key and the data and
   *                         target as the values
   */
  const configData = function (data, target, globalData, elmType) {

    //create new map
    const dataMap = _.reduce(data, function (map, val, key) {

      //config/merge global data if present
      val = !globalData ? val : _H.util.mergeGlobal({val, key, globalData});

      //find key
      ({val, key} = moduleGet(elmType, 'findKey', [val, key]));


      const regHelpMatch = {
        first: /^first\(|^fm-first\(/i,
        last: /^last\(|^fm-last\(/i,
        afterFirst: /^after-first\(|^fm-after-first\(|^afterFirst\(/i,
        fromEnd: /^from-end\(|^fm-from-end\(|^fromEnd\(/,
        between: /^between\(|^fm-between\(/,
        evenBetween: /^even-between\(|^fm-even-between\(|^evenBetween\(/,
        oddBetween: /^odd-between\(|^fm-odd-between\(|^oddBetween\(/,
        nBetween: /^n-between\(|^fm-n-between\(|^nBetween\(/,
        allBut: /^all-but\(|^fm-all-but\(|^allBut\(/,
        each: /^each\(|^fm-each\(/,
        every: /^every\(|^fm-every\(/,
        fromFirstLast: /^from-first-last\(|^fm-from-first-last\(|^fromFirstLast\(/,
        middle: /^middle\(|^fm-middle\(/,
        allButFirstLast: /^all-but-first-last\(|^fm-all-but-first-last\(|^allButFirstLast\(/,
        firstOf: /^first-of\(|^fm-first-of\(|^firstOf\(/,
        lastOf: /^last-of\(|^fm-last-of\(|^lastOf\(/,
        atLeast: /^at-least\(|^fm-at-least\(|^atLeast\(/,
        even: /^even\(|^fm-even\(/,
        odd: /^odd\(|^fm-odd\(/,
        firstLast: /^first-last\(|^fm-first-last\(|^firstLast\(/,
        unique: /^unique\(|^fm-unique\(/,
        notUnique: /^not-unique\(|^fm-not-unique\(|^notUnique\(/
        //no going to integrate right now
        // childIndex: /^child-index\(|^fm-child-index\(|^childIndex\(/,
        // at-least(num)
        // at-most(num)
        // in-between(minimum, maximum)
      };

      //checks if user is using a helpe elm key
      let match = false;
      let err = false;
      key = _.reduce(regHelpMatch, function (_key, reg, fn) {
        if (!match && _.isString(key) && _key.match(reg)) {
          match = true;
          _key = famHelp[fn](_key, reg);
          //null indicated error, to which we kill
          if (_.isNull(_key)) { err = true; }
        }
        return _key;
      }, key);


      if (err) {
        return {
          _kill: true
        };
      }

      //check to see if key is an array
      if (_.isArray(key)) {
        //since it has multiple keys we want to process each one
        //speratly so we will throw it back into the funk
        _.forEach(key, function (elmKey) {
          processElement(elmKey, _.cloneDeep(val), target, elmType);
        });
      }else {
        //seperate option from data
        let option;
        ({data: val, option} = _H.util.getOption(val));

        ({val, key, option} = moduleGet(elmType, 'dataConfig', [val, key, option]));

        const id = moduleGet(elmType, 'id', [option]);

        map = map.set(id, Immutable.fromJS({
          key: key,
          data: val,
          option: option,
          type: 'element',
          id: id
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


  teFlow.call({
    args: {
      elmKey: _elmKey,
      data: _data,
      target: _target,
      elmType: _elmType
    }},
    format,
    configData,
    wrapMap,
    queue
  );
};

module.exports = processElement;
