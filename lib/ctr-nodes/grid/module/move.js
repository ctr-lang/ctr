const _L = require('./grid-helpers.js');

/**
 * Source ordering. Shift elements left, right, up, or down, by their left or
 * top position by passing a position or negative fraction.
 *
 * @param {string} [$fraction='1/1'] - Fraction of the container to be shifted.
 *  Must be a string.
 * @param {string} [$dir=row] - Direction the grid is going. Should be the
 *  opposite of the column() or row() it's being used on.
 * @param {number} [$gut=$gutter] - Adjust the size of the gutter for this
 *  movement. Should match the element's $gut.
 *
 * @example
 *   figure
 *     column('1/2')
 *     &:first-child
 *       move('1/2')
 */

const move = function (data, option) {
  data = _L.formatData(data, {
    fraction: '1/1',
    direction: 'row',
    gutter: option.gutter
  });

  const res = {};
  //common
  res.position = 'relative';
  if (data.direction === 'row') {
    res.left = _L.getSize(data.gutter, data.fraction, true);
  }else {
    res.top = _L.getSize(data.gutter, data.fraction, true);
  }

  return res;
};

module.exports = move;
