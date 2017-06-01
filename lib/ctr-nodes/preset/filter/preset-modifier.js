const _ = require('lodash');

/**
 * Modifiers the filters
 */
const filterModifier = function (filterSource, {filter, element}) {
  //need to break all ref so that there is no leak
  filterSource = _.clone(filterSource);
  /**
   * Helper to deconstruct filter array and merge with modifing filter
   * @param  {obj} src -> modifer
   * @param  {arr} val -> source, to be modified
   * @return {obj}     -> {key: val} -> filter
   */
  const filterDeconstructBuild = function (src, val) {
    return _.defaultsDeep(src, _.reduce(val, function (prv, _val) {
      const key = _val.replace(/\(.*?\)/, '');
      let keyVal = _val.replace(/(\w|-)*?(?=\()/, '');
      keyVal = keyVal.replace(/\(|\)/g, '');
      prv[key] = keyVal;
      return prv;
    }, {}));
  };

  /**
   * Configs the filter modifiers
   */
  const filterArgs = filterDeconstructBuild(filter, _.get(filterSource, 'filter') || {});
  filterSource.filter =  _.reduce(filterArgs, function (prv, val, key) {
    if (val !== false) {
      prv.push(`${key}(${val})`);
    }
    return prv;
  }, []);

  // keys for the element modifiers corrosponding thingy
  const keys = {
    comp: 'customComponentFilterImage',
    component: 'customComponentFilterImage',
    before: 'customElementFilterBefore',
    after: 'customElementFilterAfter'
  };

  /**
   * Configures the element modifiers
   */
  filterSource = _.isEmpty(element) ? filterSource : _.reduce(element, function (prv, val, key) {
    const mergeKey = keys[key];
    prv[mergeKey] = _.defaultsDeep(val, prv[mergeKey]);
    return prv;
  }, filterSource);

  //->
  return filterSource;
};


module.exports = filterModifier;
