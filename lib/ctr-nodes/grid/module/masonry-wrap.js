const _        = require('lodash');
const _L       = require('./grid-helpers.js');
const flexCont = require('./flex-container.js');

/**
 * Creates a wrapping element for working with JS masonry libraries like Isotope.
 * Assigns a negative margin on each side of this wrapping element.
 *
 * @param {number} [$gut=$gutter] - How large the gutter involved is, typically
 *  this won't be adjusted and will inherit the global $gutter setting, but
 *  it's made available if you want your masonry grid to have a special $gut,
 *  it should match your masonry-column's $gut.
 * @param {boolean} [$flex=$flexbox] - Determines whether this element should
 *  use Flexbox or not.
 *
 * @example
 *   section
 *     masonry-wrap()
 *   figure
 *     masonry-column('1/3')
 */


const masonryWrap = function (data, option) {
  data = _L.formatData(data, {
    gutter: option.gutter,
    flex: option.flexbox
  });

  let res;
  if (data.flex) {
    res = flexCont(data, {}, true);
  }else {
    res = {
      after: {
        content: '',
        display: 'table',
        clear: 'both'
      }
    };
  }

  //common
  let gut = data.gutter === false ? '0' : data.gutter;
  //saftey check for ctrJS
  gut = _.isString(gut) ? gut : gut.toString();
  const gutNum = parseFloat(gut.replace(/[^0-9\.]+/g, ''), 0);
  const gutChar = gut.replace(/[0-9]/g, '');
  const margin = ((gutNum / 2) * -1) + gutChar;
  res['margin-left'] = margin;
  res['margin-right'] = margin;

  return res;
};

module.exports = masonryWrap;
