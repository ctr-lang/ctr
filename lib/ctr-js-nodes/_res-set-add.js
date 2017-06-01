
/**
 * Sets the results from render in the resultSet
 * @param  {str} res -> result from ctr
 * @param  {---} key -> Can pass a key although its set for you
 * @return {---}     -> sets new map
 */
const _resSetAdd = function (res, key = this.resultKey, cache = true) {
  const self = this;
  //add to store as cache
  if (cache) {
    self.resultDbMap.set(key, res);
  }
  //if duplicateCSS wrap in array
  if (self.globalOption.get('duplicateCSS')  === true) {
    self.resultSet.add([res]);
  }else {
    //add to set to be reuturnd
    self.resultSet.add(res);
  }
};


module.exports = _resSetAdd;
