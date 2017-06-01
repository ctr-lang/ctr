const fs        = require('fs');
const _         = require('lodash');
const Immutable = require('immutable');
const rcConfig  = require('./../ctr-config.js');

/**
 * Resets the set. Every style is processed independently
 * although if the data is a object with mutiple styles
 * then they are are considered a set
 */
const _resetSet = function (configOverride = false) {
  const self = this;
  //don't want to run on config override
  if (self.rendered && !configOverride) {
    //reset rendered
    self.rendered = false;
    //clear out set arry
    self.resultKeySet.length = 0;
    //check 'once' refs
    const onceKeys = ['globalOption', 'vars', 'callback', 'transform', 'yamlTransform'];
    //loop the keys
    _.forEach(onceKeys, function (key) {
      const keyPrefix = '_' + key;
      if (!_.isNil(self[keyPrefix])) {
        //reset key to old state
        self[key] = self[keyPrefix];
        //null out the prefix
        self[keyPrefix] = null;
      }
    });
  }

  //reset _selector error ref
  self._selector = '';

  //reConfig wrapper, set new options/vars for [doc]rc
  const reConfig = function () {
    const {
      rcVars,
      rcGlobalOption,
      rcFilePath,
      rcMtime
    } = rcConfig.call(self, {
      prvFilePath: self._rcFilePath,
      rcPath: self._rcUserPath || self.globalOption.get('rcPath'),
      localVarKey: self.localVarKey,
      instanceOption: self.instanceOption
    });
    //store rc's as private
    self._rcVars = Immutable.fromJS(rcVars);
    self._rcGlobalOption = Immutable.fromJS(rcGlobalOption);
    self._rcFilePath = rcFilePath || null;
    self._rcMtime = rcMtime || null;
    //update vars, we merge over here but thats all cool since
    //in theroy all the styles should rerun thus reset + establish
    self.vars = self.vars.mergeDeep(self._rcVars);
    self.globalOption = self.globalOption.mergeDeep(self._rcGlobalOption);
  };

  //if configOverride user set rcpath via option
  //otherwise check ctrrc file for chances if present
  if (configOverride) {
    reConfig();
  }else if (!self._rcConfigRan) {
    self._rcConfigRan = true;
    reConfig();
  }else if (self._rcFilePath && self._h.fileExists(self._rcFilePath)) {
    const stat = fs.statSync(self._rcFilePath);
    //check if the file as changed cus if it has we need to update
    if (stat && stat.mtime > self._rcMtime) {
      //re-config check of ctrrc
      reConfig();
    }
  }
};


module.exports = _resetSet;
