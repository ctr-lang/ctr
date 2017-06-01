const _ = require('lodash');

/**
 * Sets the global callback in which all styles created will invoke
 * @param {---} transformFn -> Function || Array of Functions
 * @param {obj} option  -> options for the nature of action
 */
const setTransform = function (transform, option = {reset: false, once: false}) {
  const self = this;
  option = _.defaults(option, {reset: false, once: false});
  //check short
  if (transform.reset) {
    self.transform.length = 0;
    return self;
  }
  //assing set options
  const {reset, once} = option;
  if (reset) { self.transform.length = 0; }
  //set
  if (_.isFunction(transform)) {
    self.rendered = false;
    if (once) {
      //set clone ref since we will revert to it after the set
      self._transform = _.cloneDeep(self.transform);
      //bind for invoke
      self.transform.push(_.bind(transform, self));
    }else {
      //bind for invoke
      self.transform.push(_.bind(transform, self));
    }
  }else if (_.isArray(transform)) {
    //cycle through
    _.forEach(transform, function (tFunk) {
      self.setTransform(tFunk, {once: once});
    });
  }else {
    self._throwErr({
      error: 'Format',
      msg: `The setTransform method only accepts a single
            function argument or an Array of functions.`
    });
  }
  return self;
};


module.exports = setTransform;
