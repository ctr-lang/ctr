const Immutable = require('immutable');

/**
 * Will merge target data for two target instances
 * @param  {map} target       -> Target instance
 * @param  {map} mergeTarget  -> Target instance to be merged
 * @return {map}              -> Merged target
 */
const targetMerge = function (target, mergeTarget) {
  if (mergeTarget && mergeTarget.size) {
    return mergeTarget.reduce(function (map, val, key) {
      if (!map.has(key)) {
        map = map.set(key, val);
      }else if (Immutable.List.isList(val)) {
        //push in new vals
        val.forEach(function (listVal) {
          map = map.update(key, function (targetList) {
            return targetList.push(listVal);
          });
        });
      }
      return map;
    }, target);

  }
  return target;
};

module.exports = targetMerge;
