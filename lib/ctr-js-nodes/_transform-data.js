const _ = require('lodash');

/**
 * Transforms the data through the set transform funks in self.transform,
 * called from the render callback
 * @param  {str} res       -> the result string of the render
 * @return {str}           -> the transformed result string
 */
const _transformData = function (res) {
  const self = this;
  //if memozed return the res, transform has already taken place
  return _.reduce(self.transform, function (str, func) {
    let transStr = func.call(self, str);
    //check for undefined return
    transStr = _.isUndefined(transStr) ? '' : transStr;
    //make sure returning a string
    if (!_.isString(transStr)) {
      const type = typeof transStr;
      const funcInQuestion = func.toString();
      self._throwErr({
        error: 'Format',
        msg: `One of your transform functions did not return a String;
              rather it returned a: "${type}". The function in question:
              ${funcInQuestion}`
      });
      //return orig string res
      return str;
    }
    return transStr;
  }, res);
};


module.exports = _transformData;
