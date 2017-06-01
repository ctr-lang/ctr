const fs = require('fs');
const _  = require('lodash');

/**
 * Helpers
 * @type {Object}
 */
const _helpers = {

  /**
   * Checks if a file exists or not
   * @param  {str} filePath -> file path to check
   * @return {bln}          -> the truth
   */
  fileExists (filePath) {
    try {
      return fs.statSync(filePath).isFile();
    }catch (err) {
      return false;
    }
  },


  /**
   * Wrapper for defaultsDeep, it operates in a similar fashion, although
   * it will merge arrays and special handle keys to convert to array need be,
   * plus I clone all the objs for the peace of mind so that mutations don't
   * fuck up my day or yours
   * @param  {obj} src -> source object
   * @param  {obj} obj -> other obj args to merege
   * @return {obj}     -> merged sourced object
   */
  defaultsDeep (src) {
    let args = [...arguments];
    if (!_.every(args, _.isPlainObject)) { return src; }
    args = _.cloneDeep(args);
    const _mergeWith = _.spread(_.mergeWith);
    return _mergeWith(_.reverse(args).concat(function (_obj, _src, _key) {
      if (_key === 'key') {
        if (_.isArray(_src) && _.isArray(_obj)) {
          //pull placeholders
          _src = _.pull(_src, '_');
          _obj = _.pull(_obj, '_');
          return  _.union(_src, _obj);
        }
      }
    }));
  },

  /**
   * Wrapper around _.get that checks multiple values and returns first match
   * @param  {obj} obj     -> object to _.get from
   * @param  {arr} keys    -> array of keys to perform _.get with
   * @param  {obj} options -> can pass a default return
   * @return {---}         -> get, or undefined
   */
  get (obj, keys, options = {}) {
    for (let i = 0; i < keys.length; i++) {
      if (_.has(obj, keys[i])) {
        return _.get(obj, keys[i]);
      }
    }
    return options.default;
  },

  /**
   * Wrapper around _.has to check multiple values
   * @param  {obj}  obj  -> object to _.has from
   * @param  {arr}  keys -> array for keys to perform _.has with
   * @return {bln}       -> da truth
   */
  has (obj, keys) {
    for (let i = 0; i < keys.length; i++) {
      if (_.has(obj, keys[i])) {
        return true;
      }
    }
    return false;
  }
};

module.exports = _helpers;
