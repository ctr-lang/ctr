const _         = require('lodash');
const teFlow    = require('te-flow');
const Immutable = require('immutable');
const throwErr  = require('./attribute-errors.js');
const _T        = require('../target/target-index.js');
const _M        = require('../manager/manager-index.js');
const _H        = require('../helpers/helper-index.js');

const processAttribute = function (_attrKey, _data, _target) {

  /**
   * Formats the data so we are always working with an object
   * to keep all things the same.
   * @param  {obj} data   -> raw data obj
   * @param  {map} target -> target instance
   * @return {---}        -> formated data obj
   */
  const format = function (attrKey, data, target) {
    let globalData;
    ({data, globalData} = _H.util.getGlobal(data));

    //plural container check, don't want to format if plural
    if (!_H.util.regularExp.pluralTest(attrKey, 'attribute')) {
      data = _H.util.formatData(data, attrKey, {globalData});
    }

    return {
      data,
      target,
      globalData
    };
  };

  /**
   * Finds/configs the element key the user wished to use
   * @param  {obj} data   -> formated data obj
   * @param  {map} target -> target instance
   * @return {map}        -> A map with the element as key and the data and
   *                         target as the values
   */
  const configData = function (data, target, globalData) {
    /**
     * Checks all the places where the user can define a attribute key
     * [attribute="value"]
     * @param  {obj} val  -> indv data obj
     * @param  {str} key  -> the default key that will be used if the
     *                       user is using the obj notation method
     * @param  {str} find -> this funk will first search for the `attribute` key
     *                       if that is not found it will then check for `key`
     * @return {---}      -> confied key and data need be
     */
    const findKey = function (val, key = null, find = 'key', nextKey = true) {

      //check for options
      if (val.option && val.option[find]) {
        key = val.option[find];
        val.option = _.omit(val.option, find);
      }else if (val[find]) {
        key = val[find];
        val = _.omit(val, find);
      }else if (_.isArray(key)) {
        //key array do nothig
      }else if (key && key.match(/(^attr-|^attribute-)/i)) {
        //assume heiphen shorthand
        key = key.match(/-(.*)/)[1];
      }else if (nextKey && find === 'key') {
        //element not found so just alias of key
        return findKey(val, key, 'attributeKey');
      }else if (key && key.match(/(^customAt)/i)) {
        key = 'attributeNotFound';
        throwErr('noKey', {[key]: val});
      }

      return {
        val,
        key
      };
    };

    //note we check to see if there is a global attr for the use-case
    //of object notation test: -attribute/key/attr-object-with-global
    let globalAttr = null;
    if (globalData && globalData.option) {
      let option = globalData.option;
      if (option.attribute) {
        //assing
        globalAttr = option.attribute;
        //remove
        globalData.option = _.omit(globalData.option, 'attribute');
      }else if (option.key) {
        //assing
        globalAttr = option.key;
        //remove
        globalData.option = _.omit(globalData.option, 'key');
      }
    }

    //create new map
    const dataMap = _.reduce(data, function (map, val, key) {

      //config/merge global data if present
      val = !globalData ? val : _H.util.mergeGlobal({val, key, globalData});

      //attrubie value
      let attrVal = null;

      //if global Attribue
      if (globalAttr) {
        //assume the obj key is our attribut value
        ({val, key: attrVal} = findKey(val, key));
        key = _.clone(globalAttr);
      }

      //default, no global attribute
      if (!globalAttr) {
        //find key
        ({val, key} = findKey(val, key));
        //find value if any
        ({val, key: attrVal} = findKey(val, key, 'value', false));
      }

      //check to see if key is an array
      if (_.isArray(key)) {
        //since it has multiple keys we want to process each one
        //speratly so we will throw it back into the funk
        _.forEach(key, function (attrKey) {
          processAttribute(attrKey, _.cloneDeep(val), target);
        });
      }else {
        //seperate option from data
        let option;
        ({data: val, option} = _H.util.getOption(val));

        //internal append to
        option._appendTo = true;

        if (attrVal !== key) {
          //format check
          key = key.charAt(key.length - 1) === '=' ? key : key + '=';
          attrVal = attrVal.charAt(0) === '"' ? attrVal : '"' + attrVal + '"';
          //add dem together
          key += attrVal;
        }

        //formate key
        key = key.charAt(0) === '[' ? key : '[' + key + ']';


        const attrId = _H.util._id.gen('attribute');

        map = map.set(attrId, Immutable.fromJS({
          key: key,
          data: val,
          option: option,
          type: 'element',
          id: attrId
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
      _M._queue.add(valMap);
    });
  };


  teFlow.call({
    args: {
      attrKey: _attrKey,
      data: _data,
      target: _target
    }},
    format,
    configData,
    wrapMap,
    queue
  );
};

module.exports = processAttribute;
