const _  = require('lodash');

/**
 * Sets global yaml transformations
 * @param {---} transformFn -> fnc | [fnc]
 * @param {obj} option      -> options for the nature of action
 */
const setYamlTransform = function (transformFn, option = {}) {
  const self = this;
  option = _.defaults(option, {reset: false, once: false});
  //check short
  if (transformFn.reset) {
    self.yamlTransform.length = 0;
    return self;
  }
  //assing set options
  const {reset, once} = option;
  if (reset) { self.yamlTransform.length = 0; }

  if (_.isFunction(transformFn)) {
    self.rendered = false;
    if (once) {
      //set clone ref since we will revert to it after the set
      self._yamlTransform = _.cloneDeep(self.yamlTransform);
      //bind for invoke
      self.yamlTransform.push(_.bind(transformFn, self));
    }else {
      //bind for invoke
      self.yamlTransform.push(_.bind(transformFn, self));
    }
  }else if (_.isArray(transformFn)) {
    //cycle through
    _.forEach(transformFn, function (tFunk) {
      self.setYamlTransform(tFunk, {once: once});
    });
  }else {
    self._throwErr({
      error: 'Format',
      msg: `The setYamlTransform method only accepts a single
            function argument or an Array of functions.`
    });
  }
  return self;
};


module.exports = setYamlTransform;
