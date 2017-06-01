const _ = require('lodash');

/**
 * Gets the results from the resultSet
 * @param  {bln} reset -> to reset the style res set
 * @param  {bln} raw   -> if the results should be returned in array format
 * @return {---}       -> string | Set
 */
const getResult = function (reset = true, raw = false) {
  const self = this;
  //if object assing the vars
  if (_.isPlainObject(reset)) {
    ({reset, raw} = reset);
  }
  //render was never called so as a champion of the people we call it
  if (!self.rendered) {
    self._render();
  }
  //Create a new set, effectivly cloning it since we are about to
  //clear out and reset the self ref
  const dataSet = new Set(self.resultSet);
  //reset unless specified otherwise
  //The reson this is done is becuase in dev env everytime a user saves
  //ctr will run. So if we don't repopulate the set everytime ctr runs
  //a user could delete a style yet we would still return the set with that style.
  //Although, the res is saved in resulDbtMap so next time around we cache
  if (reset !== false) {
    self.resultSet.clear();
  }

  //return raw set or spread and join the dataMap for a return String, CSS -> Boom!
  return raw ? dataSet : [...dataSet.values()].join('');
};

module.exports = getResult;
