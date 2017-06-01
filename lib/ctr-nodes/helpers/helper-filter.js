const _          = require('lodash');
const _H         = require('../helpers/helper-index.js');
const getFilter  = require('./../preset/preset-index.js');

/**
 * Checks for a filter preset, if match then it processes and adds it to the quene.
 * @param  {map} staticArgs -> map args from index
 * @param  {map} target     -> target instance
 * @return {map}            -> cleaned of edit
 */
const filter = function (staticArgs, objectArgs) {
  //get filter and ensure its a single string without ( to match our def
  const applyFilter = staticArgs.get('filter') || objectArgs.get('filter');
  //make sure we have glamor filters to work with, ie checks the format
  if (!_.isPlainObject(applyFilter) && (applyFilter.includes('(') || _.isArray(applyFilter))) {
    return {staticArgs, objectArgs};
  }
  //get/set filter
  const objFilter = _.isPlainObject(applyFilter);
  const preset = objFilter && _.has(applyFilter, 'preset')
               ? _.get(applyFilter, 'preset')
               : applyFilter;

  //remove filter from ref map
  if (objFilter) {
    objectArgs = objectArgs.delete('filter');
  }else {
    staticArgs = staticArgs.delete('filter');
  }

  //filter modifier configure
  const filterList = ['url', 'blur', 'brightness', 'contrast', 'drop-shadow', 'grayscale', 'hue-rotate', 'invert', 'opacity', 'saturate', 'sepia'];
  const filterModifiers = objFilter ? _.reduce(filterList, function (prv, val) {
    if (_.has(applyFilter, val)) {
      prv[val] = _.get(applyFilter, val);
    }
    return prv;
  }, {}) : {};

  //element modifier configure
  const elmList = ['after', 'before', 'comp', 'component'];
  const elmModifiers = objFilter ? _.reduce(elmList, function (prv, val) {
    if (_.has(applyFilter, val)) {
      prv[val] = _.get(applyFilter, val);
    }
    return prv;
  }, {}) : {};

  //construct the filter args to be merged back in
  const filterArgs = _.isString(preset)
                  ?  getFilter('filter', preset, {modifiers: {filter: filterModifiers, element: elmModifiers}})
                  // build filter array if no preset
                  : {filter: _.reduce(filterModifiers, function (prv, val, key) {
                    prv.push(`${key}(${val})`);
                    return prv;
                  }, [])};

  /**
   * Have to seperate out the static and object for return to process
   */
  const excludeKeys = ['option', 'query', 'shorthand', 'mixin'];
  ({staticArgs, objectArgs} = _.reduce(filterArgs, function (map, val, key) {
    const addTo = _.isPlainObject(val) ? 'objectArgs' : 'staticArgs';
    if (!_.includes(excludeKeys, key)) {
      map[addTo] = map[addTo].update(key, function (_val) {
        if (!_val) {
          return val;
        }else if (_val && _.isUndefined(val)) {
          return _val;
        }else if (_.every([_val, val], _.isPlainObject)) {
          return _H.util.merge(val, _val);
        }else if (_.every([_val, val], _.isArray)) {
          return _.union(val, _val);
        }
        return val;
      });
    }
    return map;
  }, {staticArgs, objectArgs}));


  //return statMap without filter
  return {
    staticArgs,
    objectArgs
  };
};

module.exports = filter;
