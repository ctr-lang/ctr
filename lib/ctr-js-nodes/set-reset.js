const _  = require('lodash');

/**
 * Resets all the 'set' data, which can be hella useful since it
 * ensures you are working with a fresh sheet of ice
 * @param {---} resetDefaults -> if object sets the defaults
 */
const setReset = function (resetDefaults = false) {
  const self = this;
  //set default data is presant
  if (_.isPlainObject(resetDefaults)) {
    //@depr vars and options, plural
    const {callback, vars, variable, options, option, transform, yamlTransform} = resetDefaults;
    if (vars) { self.setVariable(vars === true ? {} : vars, {reset: true}); }
    if (variable) { self.setVariable(variable === true ? {} : variable, {reset: true}); }
    if (option) { self.setOption(option === true ? {} : option, {reset: true}); }
    if (options) { self.setOption(options === true ? {} : options, {reset: true}); }
    if (callback) {
      if(callback === true) { self.callback = false; }else {self.setCallback(callback, {reset: true});}
    }
    if (transform) {
      if (transform === true) { self.transform = []; }else { self.setTransform(transform, {reset: true});}
    }
    if (yamlTransform) {
      if (transform === true) { self.yamlTransform = []; }else { self.setYamlTransform(transform, {reset: true}); }
    }
  }else {
    //reset
    self.vars = self._rcVars;
    self.globalOption = self._rcGlobalOption;
    self.callback = false;
    self.transform = [];
    self.yamlTransform = [];
  }
  return self;
};


module.exports = setReset;
