const stylus = require('stylus');
const _      = require('lodash');
const _M     = require('../manager/manager-index.js');
const Nodes  = stylus.nodes;
const Utils  = stylus.utils;

/**
 * Sort helper, configs our sort based on type
 */
const sortKeysBy = function (obj, comparator) {
  const keys = _.sortBy(_.keys(obj), function (key) {
    return comparator ? comparator(obj[key], key) : key;
  });
  return _.zipObject(keys, _.map(keys, function (key) {
    return obj[key];
  }));
};

/**
 * Sorts the props/key before converting js obj to stylus
 */
const sortKeys = function (rtObj, sortBy) {
  if (sortBy === 'len' || sortBy === '-len') {
    return sortKeysBy(rtObj, function (val, key) {
      //for array val
      const arrLen = !_.isArray(val) ? false : JSON.stringify(val.join(' ')).length;
      return JSON.stringify(key).length
             //abc's alway come out top when === length
             + (key.charAt(0).charCodeAt(0) * 0.01)
             + (arrLen || JSON.stringify(val).length);
    });
  }else if (sortBy === 'abc' || sortBy === '-abc') {
    return sortKeysBy(rtObj, function (val, key) {
      return key;
    });
  }
  return rtObj;
};

/**
 * Convers js, into Stylus nodes and then pipes it though ctr.styl
 * @param  {obj} rtObj   -> object to be converted
 * @param  {obj} options -> options
 */
const toStylus = function (rtObj, options = {}) {
  const sortKey = _M._option.getIn(['global', 'sort']);
  let reduce = _.reduceRight;
  //@dev/test
  //@todo - add option?
  if (_.isString(sortKey)) {
    //If timeline we don't want to sort the % kets
    if (options.timeline) {
      rtObj = _.reduceRight(rtObj, function (prv, val, key) {
        prv[key] = sortKeys(val, sortKey);
        return prv;
      }, {});
    }else {
      //default
      rtObj = sortKeys(rtObj, sortKey);
      if (sortKey === 'len' || sortKey === 'abc') {
        reduce = _.reduce;
      }
    }
  }else if (sortKey === false) {
    reduce = _.reduce;
  }

  const res = reduce(_.keys(rtObj), function (prv, key) {
    let val = rtObj[key];
    if (_.isString(val)) {
      val = new Nodes.Literal(val);
    } else if (_.isNumber(val)) {
      val = new Nodes.Unit(val);
    }else if (_.isArray(val)) {
      val = new Nodes.Literal(val.join(' '));
    }else if (_.isObject(val)) {
      val = toStylus(val);
    }else if (_.isBoolean(val)) {
      val = new Nodes.Boolean(val);
    }else {
      console.log(`ctr: possible error while converting to stylus.
                  The value: "${val}", for the "${key}" node could not
                  be convertred into stylus. The error could be a due to a
                  whole slew of issues so I'm just going to tell you that
                  you got issues.`.replace(/\s{2,}/gm, ' '));
    }

    prv[key] = val;
    return prv;
  }, {});

  return Utils.coerceObject(res, true);
};

module.exports = toStylus;
