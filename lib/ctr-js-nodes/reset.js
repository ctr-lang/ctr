
/**
 * Resets everything including the db map + class, ie cached results,
 * including all the set data
 * @param {---} resetDefaults -> if object sets the defaults
 */
const reset = function (resetDefaults = false) {
  const self = this;
  //reset set data
  self.setReset(resetDefaults);
  //clear out db data
  self.resultSet.clear();
  self.resultDbMap.clear();
  self.ctrClass = self.ctrClass.clear();
  self._ctrClassRaw = self._ctrClassRaw.clear();
  self.resultKey = null;
  self.resultKeySet = [];
  self.error = false;
  self.stylusError = false;
  self.res = '';
  self.rendered = false;
  self.localVarKey = '$$';
  self._rcConfigRan = false;
  //selector ref for error location
  self._selector = '';
  //reset
  return self;
};

module.exports = reset;
