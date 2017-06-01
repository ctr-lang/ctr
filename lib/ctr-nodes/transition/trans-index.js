const _       = require('lodash');
const teFlow  = require('te-flow');
const config  = require('./trans-config.js');
const extract = require('./trans-extract.js');
const compose = require('./trans-compose.js');

/**
 * This it the entry point to generating the transiton. Its callled
 * upon anytime a transioiton happens. Either that will be a global
 * transition of a state inkoved transiton. It will then return
 * a list of the generated transition and that list will contain
 * the resulting trans and the target which was generated via
 * the trans.
 * @param  {obj} data -> The data raw obj
 * @return {map}      -> {trans: props, target: map}
 */
const transGenerate = function (transKey, data, target, option = {}) {
  //set default option
  option = _.defaults(option, {
    //this is only ture when called directly via global-trans
    stackProcess: false
  });
  return teFlow.call({
    args: {
      transKey: transKey,
      data: data,
      target: target,
      option: option
    }},
    //-> call order
    config,
    extract,
    compose, {
      return: function (transList) {
        //-> List return
        return transList;
      }
    }
  );
};

module.exports = transGenerate;
