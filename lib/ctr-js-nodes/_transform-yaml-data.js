const _ = require('lodash');

/**
 * Transforms YAML object data before its sent off to be rendered,
 * called in yaml method
 * @param  {obj} data -> parsed yaml obj
 * @return {obj}      -> transformed yaml obj
 */
const _transformYamlData = function (data) {
  const self = this;
  return _.reduce(self.yamlTransform, function (obj, funk) {
    let transObj = funk.call(self, obj);
    //check for undefined return
    transObj = _.isUndefined(transObj) ? {} : transObj;
    //make sure returning a Object
    if (!_.isPlainObject(transObj)) {
      const type = typeof transObj;
      const funkInQuestion = funk.toString();
      self._throwErr({
        error: 'Format',
        msg: `One of your yamlt ransform functions did not return a Object;
              rather it returned a: "${type}". The function in question:
              ${funkInQuestion}`
      });
      //return orig string res
      return transObj;
    }
    return transObj;
  }, data);
};

module.exports = _transformYamlData;
