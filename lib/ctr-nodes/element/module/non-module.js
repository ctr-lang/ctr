const _        = require('lodash');
const throwErr = require('./non-module-errors.js');
const _H       = require('../../helpers/helper-index.js');

const nonModule = {

  /**
   * Checks all the places where the user can define a element key
   * @param  {obj} val  -> indv data obj
   * @param  {str} key  -> the default key that will be used if the
   *                       user is using the obj notation method
   * @return {---}      -> confied key and data need be
   */
  findKey: function (val, key = null, find = 'key') {
    const self = this;
    //check for options
    if (val.option && val.option[find]) {
      key = val.option[find];
      val.option = _.omit(val.option, find);
    }else if (val[find]) {
      key = val[find];
      val = _.omit(val, find);
    }else if (find === 'key') {
      //element not found so just alias of key
      return self.findKey(val, key, 'nonKey');
    }else if (key && key.match(/(^not-|^non-)/i)) {
      //assume heiphen shorthand
      key = key.match(/-(.*)/)[1];
    }else if (key && key.match(/(^customNo)/i)) {
      key = 'nonNotFound';
      throwErr('noKey', {[key]: val});
    }

    if (key !== 'nonNotFound') {
      key = _.isString(key) ? 'not(' + key + ')' : key;
    }

    return {
      val,
      key
    };
  },


  /**
   * Configs the data for the element type, speficically psedo elms and such
   * @param  {obj} val    -> cur data val
   * @param  {str} key    -> key of elm
   * @param  {obj} option -> option of the data context
   * @return {obj}        -> values configued
   */
  dataConfig: function (val, key, option) {

    //config psudo key
    ({key, option} = _H.util.configPseudoKey(key, option));

    return {
      val,
      key,
      option
    };
  },

  /**
   * Gens id
   * @return {str} -> cust id
   */
  id: function (option) {
    //again due to pr-#207, this time it has to relate to
    //key order sorting in target-stack-manager, fn `ccomposeCdrOrder`
    return option._nonWrap
           ? _H.util._id.gen('_non')
           : _H.util._id.gen('non');
  }
};


module.exports = nonModule;
