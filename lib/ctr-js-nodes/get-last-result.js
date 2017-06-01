const _ = require('lodash');

/**
 * Gets the last results from the resultSet
 * @param  {bln} reset -> to reset the style res set
 * @param  {bln} raw   -> if the results should be returned in array format
 * @return {---}       -> string | arrry
 */
const getLastResult = function (reset = false, raw = false) {
  const self = this;
  //if object assing the vars
  if (_.isPlainObject(reset)) {
    ({reset, raw} = reset);
  }
  //render was never called so as a champion of the people we call it
  if (!self.rendered) {
    self._render();
  }
  //construct datamap from last result key set
  const dataSet = new Set();
  for (let i = 0; i < self.resultKeySet.length; i++) {
    dataSet.add(self.resultDbMap.get(self.resultKeySet[i]));
  }
  //reset if specified
  if (reset) {
    const duplicateCSS = self.globalOption.get('duplicateCSS') === true;
    const dupSet = duplicateCSS ? new Set(self.resultSet) : null;
    const rmvStyles = duplicateCSS ? new Set() : null;
    //cycle through and delete or build depending on duplicateCSS
    for (let r = 0; r < self.resultKeySet.length; r++) {
      const style = self.resultDbMap.get(self.resultKeySet[r]);
      //if duplicate css, we have to pull some jank since [1] !== [1]
      if (duplicateCSS) {
        //clear and rebuild from copy - dupSet
        self.resultSet.clear();
        dupSet.forEach(function (val) {
          val = val[0];
          if (val !== style && !rmvStyles.has(val)) {
            self.resultSet.add(val);
          }else {
            //keep track of removed styles as to no re-add them
            rmvStyles.add(val);
          }
        });
      }else {
        self.resultSet.delete(style);
      }
    }
  }

  //retun raw or spread and join the dataMap for a return string
  return raw ? dataSet : [...dataSet.values()].join('');
};

module.exports = getLastResult;
