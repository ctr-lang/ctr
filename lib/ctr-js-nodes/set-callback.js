const _         = require('lodash');

/**
 * Sets the global Stylus callback in which all styles created will invoke
 * @param {fnk} fn -> callback funk
 */
const setCallback = function (cb, option = {}) {
  const self = this;
  option = _.defaults(option, {reset: false, once: false});
  //check short
  if (cb.reset) {
    self.callback = false;
    return self;
  }
  //assing set options, the resaon reset is not preset is becuase
  //we don't need to reset if there is a cb since it is a reset
  const {once} = option;
  if (_.isFunction(cb)) {
    self.rendered = false;
    if (once) {
      //set clone ref since we will revert to it after the set
      self._callback = self.callback;
      //bind for invoke
      self.callback = _.bind(cb, self);
    }else {
      //bind for invoke
      self.callback = _.bind(cb, self);
    }
  }else {
    self._throwErr({
      error: 'Format',
      msg: 'The setCallback method only accepts a single function argument.'
    });
  }
  return self;
};


module.exports = setCallback;
