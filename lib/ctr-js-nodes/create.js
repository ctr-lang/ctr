const _ = require('lodash');

/**
 * Creates styles for a ctr instance by sending the data into the render
 * function. This method is really just a wrapper for render but its makes
 * the users intentions much clearer as to what they are doing
 * @param  {---} selector    -> str | obj made up of key values
 * @param  {---} data        -> obj | str | lit
 * @param  {obj} option      -> options for ctr instance
 * @param  {---} transformFn -> funk, [funk]
 * @return {ref}             -> this ref
 */
const create = function (selector, data, option = {}, transformFn = false) {
  const self = this;

  //config args need be
  if (_.isFunction(option)) {
    transformFn = option;
    option = {};
  }else if (_.isFunction(data)) {
    transformFn = data;
    data = {};
    option = {};
  }

  //checks for object based data, if so we set a private options
  //for render to pick up to as to no to interfear with getLastResSet
  if (!_.isString(selector) && _.isPlainObject(selector)) {
    option = _.isPlainObject(data) ? data : option;
    option.__object__ = true;
  }

  //new sheet of ice
  self._resetSet();

  //auto render unless specified
  if (!_.isPlainObject(option)) {
    self._render(transformFn, selector, data, option);
  }else if (option.render !== false) {
    self._render(transformFn, selector, data, option);
  }
  return self;
};

module.exports = create;
