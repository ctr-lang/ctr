const _         = require('lodash');
const Immutable = require('immutable');
const _L        = require('./grid-helpers.js');
const _M        = require('../../manager/manager-index.js');

/**
 * Creates a row that is a fraction of the size of it's containing
 * element with a gutter. You don't need to pass any additional ratios (fractions)
 * as the grid system will make use of calc(). Note that fractions must always
 * be wrapped in quotes.
 *
 * @param {string} [$fraction='1/1'] - This is a simple fraction of the
 *  containing element's height. This must be a string written as a fraction.
 * @param {number} [$gut=$gutter] - The margin on the bottom of the element used
 *  to create a gutter. Typically this is left alone and the global $gutter
 *  will be used, but you can override it here if you want certain elements to
 *  have a particularly large or small gutter (pass 0 for no gutter at all).
 * @param {boolean} [$flex=$flexbox] - Determines whether this element should
 *  use Flexbox or not.
 *
 * @example
 *   figure
 *     row('1/3')
 */
const column = function (data, option, target) {
  data = _L.formatData(data, {
    fraction: '1/1',
    gutter: option.gutter,
    flex: option.flexbox
  });

  /**
   * Generates a child class by throwing it into the queue
   * @param  {str} elm -> element type
   * @param  {obj} css -> css to implement with elm type
   * @return {---}     -> Puts it in the queue
   */
  const genChild = function (elm, css) {
    const dataStruc = {
      customEl: {
        option: {
          key: elm
        }
      }
    };
    dataStruc.customEl = _.defaults(dataStruc.customEl, css);
    const dataMap = Immutable.fromJS(dataStruc);

    //add it the queue
    _M._queue.add(Immutable.Map({
      data: dataMap,
      target: target
    }), {
      processNow: true
    });
  };

  //return res
  const res = {};
  data.gutter = data.gutter === false ? '0' : data.gutter;
  //with is the same for all
  res.height = _L.getSize(data.gutter, data.fraction);
  res.width = '100%';
  res['margin-bottom'] = data.gutter;
  //flexbox
  if (data.flex) {
    res.flex = ['0', '0', 'auto'];
  }
  genChild('last-child', {'margin-bottom': '0'});

  return res;
};

module.exports = column;
