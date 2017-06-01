const _  = require('lodash');
const _L = require('./grid-helpers.js');

/**
 * Margin to the left, right, bottom, or top, of an element depending on if the
 * fraction passed is positive or negative. It works for both horizontal
 * and vertical grids but not both.
 *
 * @param {string} [$fraction='1/1'] - Fraction of the container to be offset.
 *  Must be a string.
 * @param {string} [$dir=row] - Direction the grid is going. Should be the
 *  opposite of the column() or row() it's being used on.
 * @param {number} [$gut=$gutter] - How large the gutter involved is, typically
 *  this won't be adjusted, but if you have set the elements for that container
 *  to have different gutters than default, you will need to match that gutter
 *  here as well.
 *
 * @example
 *   .two-elements
 *     column('1/3')
 *     &:first-child
 *       offset('1/3')
 */

const column = function (data, option) {
  data = _L.formatData(data, {
    fraction: '1/1',
    direction: 'row',
    gutter: option.gutter
  });
  let numerator = data.fraction.split('').shift() !== '-'
                  ? data.fraction.split('').shift()
                  : '-' + data.fraction.split('')[1];
  numerator = parseFloat(numerator, 0);
  let gut = data.gutter === false ? '0' : data.gutter;
  //saftey check for ctrJS
  gut = _.isString(gut) ? gut : gut.toString();
  const gutNum = parseFloat(gut.replace(/[^0-9\.]+/g, ''), 0);
  const frac = data.fraction;

  /**
   * Wrapper funk to get size
   * @return {str} -> size
   */
  const getSize = function () {
    const size1 = 'calc(99.999999% * ' + frac + ')';
    const sizeRow2 = `calc(99.9% * (-${frac} * -1) - (${gut} - ${gut} * (-${frac} * -1)) + ${gut})`;
    const sizeCol2 = `calc(99.9% * ${frac} - (${gut} - ${gut} * ${frac}) + (${gut} * 2))`;
    const size3 = 'calc(99.999999% * (' + frac + ' * -1))';
    if (data.direction === 'row') {
      if (numerator > 0) {
        if (gutNum === 0) {
          return size1;
        }
        return sizeRow2;
      }else if (gutNum === 0) {
        return size3;
      }
      return `calc(99.9% * ${frac} - (${gut} - ${gut} * ${frac}) + ${gut})`;
    }else if (numerator > 0) {
      if (gutNum === 0) {
        return size1;
      }
      return sizeCol2;
    }else if (gutNum === 0) {
      return size3;
    }
    return 'calc(99.9% * ' + '(' + frac + '*' + '-1' + ')' + ' - (' + gut + ' - ' + gut + ' * ' + '(' + frac + '*' + '-1' + ')' + ') + ' + gut + ')';
  };

  //return res
  const res = {};
  if (data.direction === 'row') {
    if (numerator > 0) {
      res['margin-left'] = getSize() + ' !important';
    }else if (numerator < 0) {
      res['margin-left'] = getSize() + ' !important';
    }else {
      res['margin-left'] = '0' + ' !important';
      res['margin-left'] = gut + ' !important';
    }
  }else if (numerator > 0) {
    res['margin-bottom'] = getSize() + ' !important';
  }else if (numerator < 0) {
    res['margin-top'] = getSize() + ' !important';
  }else {
    res['margin-top'] = '0' + ' !important';
    res['margin-bottom'] = gut + ' !important';
  }

  return res;
};

module.exports = column;
