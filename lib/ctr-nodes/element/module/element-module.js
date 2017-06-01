const _        = require('lodash');
const throwErr = require('./element-module-errors.js');
const _H       = require('../../helpers/helper-index.js');

const elementModule = {

  /**
   * Checks all the places where the user can define a element key
   * @param  {obj} val  -> indv data obj
   * @param  {str} key  -> the default key that will be used if the
   *                       user is using the obj notation method
   * @param  {str} find -> this funk will first search for the `element` key
   *                       if that is not found it will then check for `key`
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
      return self.findKey(val, key, 'elementKey');
    }else if (key && key.match(/(^elm-|^element-)/i)) {
      //assume heiphen shorthand
      key = key.match(/-(.*)/)[1];
    }else if (key && key.match(/(^customEl)/i)) {
      key = 'elementNotFound';
      throwErr('noKey', {[key]: val});
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
    //colon pseudo key config
    ({key, option} = _H.util.configPseudoKey(key, option));
    //check for content and add extra set of quotes
    //so that stylus compiles as string not literal
    //content.join for -> content Concatenation #764
    const content = _.isArray(val.content) ? val.content.join(' ') : val.content;
    if (content === false) {
      //false values is empty
      val.content = '""';
    }else if (_.isString(content) && content.charAt(0) !==  '"' && option.stringify !== false) {
      //check to make sure we don't dub quote
      val.content = '"' + content + '"';
    }

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
  id: function () {
    return _H.util._id.gen('element');
  }
};


module.exports = elementModule;
