const _         = require('lodash');
const Immutable = require('immutable');

/**
 * Sets the global option in which all styles created will inherit
 * @param {obj} option -> option object for ctr
 */
const setOption = function (ctrOptions = {}, option = {}) {
  const self = this;
  option = _.defaults(option, {reset: false, once: false, ctrrc: true, overwrite: false});
  //check short
  if (ctrOptions.reset) {
    option = ctrOptions;
    ctrOptions = {};
  }
  //assing set options
  const {reset, once, ctrrc, overwrite} = option;
  if (_.isPlainObject(ctrOptions)) {
    const setR = (r) => r === true ? {} : r;
    self.rendered = false;
    if (once) {
      //set clone ref since we will revert to it after the set
      self._globalOption = self.globalOption;
      //setOption always trumps
      self.globalOption = !reset
                          //no reset -> just once
                        ? self.globalOption.mergeDeep(Immutable.fromJS(ctrOptions))
                        : _.isPlainObject(reset) || ctrrc === false
                          //reset is a specified object
                        ? Immutable.fromJS(setR(reset)).mergeDeep(Immutable.fromJS(ctrOptions))
                        : self._rcGlobalOption.mergeDeep(Immutable.fromJS(ctrOptions));
    }else if (reset) {
      //if reset we merge in the set rc option if any
      self.globalOption = _.isPlainObject(reset) || ctrrc === false
                        ? Immutable.fromJS(setR(reset)).mergeDeep(Immutable.fromJS(ctrOptions))
                        : self._rcGlobalOption.mergeDeep(Immutable.fromJS(ctrOptions));
    }else {
      //setOption always trumps
      self.globalOption = self.globalOption.mergeDeepWith(function (src, val, prop) {
        //overwrite return new val
        if (overwrite) { return val; }
        //check if value is equal
        if (_.isEqual(src, val)) { return src; }
        self._throwErr({
          error: 'setOption Overwrite',
          msg: `It looks like you are overwriting a setOption property. The property,
          in question is: "${prop}" and its current value is: "${src}", and you are
          attempting to overwrite it with: "${val}". If you wish to perform this action
          you can do so by passing an option Object of {overwrite: true} as the second argument.`
        });
        return src;
      }, Immutable.fromJS(ctrOptions));
    }
  }else {
    self._throwErr({
      error: 'Format',
      msg: 'The setOption method only accepts a single object argument. Current: ' + ctrOptions
    });
  }
  //check for rcpath set if so call reset to process the path
  if (_.has(ctrOptions, 'rcPath')) { self._resetSet(true); }
  return self;
};

module.exports = setOption;
