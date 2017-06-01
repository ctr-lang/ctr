const _  = require('lodash');
const _L = require('./grid-helpers.js');

/**
 * Creates a column for working with JS masonry libraries like Isotope.
 * Assigns a margin to each side of the element.
 *
 * @param {number} [$gut=$gutter] - How large the gutter involved is, typically
 *  this won't be adjusted and will inherit the global $gutter setting, but it's
 *  made available if you want your masonry grid to have a special $gut, it
 *  should match your masonry-row's $gut.
 * @param {boolean} [$flex=$flexbox] - Determines whether this element should use
 *  Flexbox or not.
 *
 * @example
 *   section
 *     masonry-wrap()
 *   figure
 *     masonry-column('1/3')
 */

const masonryColumn = function (data, option) {
  data = _L.formatData(data, {
    fraction: '1/1',
    gutter: option.gutter,
    flex: option.flexbox
  });
  let res = {};
  let frac = data.fraction;
  let gut = data.gutter === false ? '0' : data.gutter;
  //safty to since we need string for ctrJS
  gut = _.isString(gut) ? gut : gut.toString();
  let gutNum = parseFloat(gut.replace(/[^0-9\.]+/g, ''), 0);
  let gutChar = gut.replace(/[0-9]/g, '');
  let margin = (gutNum / 2) + gutChar;
  res['margin-left'] = margin;
  res['margin-right'] = margin;

  /**
   * Wrapper funk to get size
   * @return {str} -> size
   */
  const getSize = function() {
    if (gutNum === 0) {
      return 'calc(99.999999% * ' + frac + ')';
    }
    return 'calc(99.9% * ' + frac + ' - ' + gut + ')';
  };

  res.width = getSize();

  if (data.flex) {
    res.flex = [0, 0, 'auto'];
  }else {
    res.float = 'left';
  }

  return res;
};

module.exports = masonryColumn;
