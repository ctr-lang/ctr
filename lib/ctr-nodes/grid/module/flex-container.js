const Immutable = require('immutable');
/**
 * Creates a Flexbox container.
 *
 * @param {string} [$direction=row]
 * The flex-direction the container should create.
 * This is typically opposite to the element you're creating
 * so a row() would need flex-container(column).
 *
 * @example
 *   $flexbox = true
 *
 *   section
 *     flex-container()
 *     figure
 *       column('1/2')
 */
const flexContainer = function (data, res = {}, defaultDir) {
  //config direction
  let direction;
  let key;
  //config key based on the map
  if (Immutable.Map.isMap(defaultDir)) {
    key = data;
    res = {};
  }else {
    key = defaultDir || data;
  }
  //if gate
  if (key === true) {
    //default to row
    direction = 'row wrap';
  }else if (key === 'row') {
    direction = 'row wrap';
  }else if (key === 'column') {
    direction = 'column nowrap';
  }else {
    direction = key;
  }
  //set res
  res.display = 'flex';
  res['flex-flow'] = direction;
  return res;
};

module.exports = flexContainer;
