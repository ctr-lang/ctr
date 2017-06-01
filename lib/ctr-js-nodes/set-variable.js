const _         = require('lodash');
const Immutable = require('immutable');

/**
 * Sets the global option in which all styles created will inherit
 * @param {obj} option -> option object for ctr
 */
const setVariable = function (vars = {}, option = {}) {
  const self = this;
  option = _.defaults(option, {reset: false, once: false, ctrrc: true, overwrite: false});
  //check short
  if (vars.reset) {
    option = vars;
    vars = {};
  }
  //assing set options
  const {reset, once, ctrrc, overwrite} = option;
  //syntax check
  if (_.isPlainObject(vars)) {
    const setR = (r) => r === true ? {} : r;
    self.rendered = false;
    if (once) {
      //set clone ref since we will revert to it after the set
      self._vars = self.vars;
      //setvar always trumps
      self.vars = !reset
                  //no reset -> just once
                ? self.vars.mergeDeep(Immutable.fromJS(vars))
                : _.isPlainObject(reset) || ctrrc === false
                  //specified reset object
                ? Immutable.fromJS(setR(reset)).mergeDeep(Immutable.fromJS(vars))
                : self._rcVars.mergeDeep(Immutable.fromJS(vars));
    }else if (reset) {
      //if reset we merge in the set rc option if any
      self.vars = _.isPlainObject(reset) || ctrrc === false
                ? Immutable.fromJS(setR(reset)).mergeDeep(Immutable.fromJS(vars))
                : self._rcVars.mergeDeep(Immutable.fromJS(vars));
    }else {
      //setVariable always trumps
      self.vars = self.vars.mergeDeepWith(function (src, val, prop) {
        //overwrite return new val
        if (overwrite) { return val; }
        //check if value is equal
        if (_.isEqual(src, val)) { return src; }
        self._throwErr({
          error: 'setVariable Overwrite',
          msg: `It looks like you are overwriting a setVariable property. The property,
          in question is: "${prop}" and its current value is: "${src}", and you are
          attempting to overwrite it with: "${val}". If you wish to perform this action
          you can do so by passing an option Object of {overwrite: true} as the second argument.`
        });
        return src;
      }, Immutable.fromJS(vars));
    }
  }else {
    self._throwErr({
      error: 'Format',
      msg: 'The setVariable method only accepts a single object argument. Current: ' + vars
    });
  }
  return self;
};


module.exports = setVariable;
