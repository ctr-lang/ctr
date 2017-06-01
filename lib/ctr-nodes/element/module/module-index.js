const elementModule = require('./element-module.js');
const nonModule     = require('./non-module.js');

/**
 * Gets module data my invoking modules funks.
 * @param  {str} type   -> module type, element or non
 * @param  {str} invoke -> the funk we want to invoke
 * @param  {arr}  args  -> an array of arguments we wish to pass
 * @return {---}        -> what ever the res is from the invoke
 */
const getModule = function (type, invoke, args = []) {
  //set modual
  let module;
  if (type === 'element') {
    module = elementModule;
  }else if (type === 'non') {
    module = nonModule;
  }

  //invoke and return
  return module[invoke].apply(module, args);
};

module.exports = getModule;
