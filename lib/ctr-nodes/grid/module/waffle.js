const _         = require('lodash');
const Immutable = require('immutable');
const _L        = require('./grid-helpers.js');
const _M        = require('../../manager/manager-index.js');

/**
 * Creates a block that is a fraction of the size of it's containing element
 * with a gutter on the right and bottom. You don't need to pass any additional
 * ratios (fractions) as the grid system will make use of calc().
 * Note that fractions must always be wrapped in quotes.
 *
 * @param {string} [$fraction='1/1'] - This is a simple fraction of the
 *  containing element's width/height. This must be a string written as a fraction.
 * @param {number} [$cycle=convert(unquote(split('/', $fraction)[1]))] - Lost
 *  works by assigning a margin-right/bottom to all elements except the last
 *  row (no margin-bottom) and the last column (no margin-right). It does this
 *  by default by using the denominator of the fraction you pick. To override
 *  this default use this param. e.g. waffle('2/4', $cycle: 2)
 * @param {number} [$gut=$gutter] - The margin on the right and bottom side of
 * the element used to create a gutter. Typically this is left alone and the
 * global $gutter will be used, but you can override it here if you want certain
 * elements to have a particularly large or small gutter (pass 0 for no gutter at all).
 * @param {boolean} [$flex=$flexbox] - Determines whether this element should use Flexbox or not.
 *
 * @example
 *   figure
 *     waffle('1/3')
 */

const column = function (data, option, target) {
  data = _L.formatData(data, {
    fraction: '1/1',
    cycle: '1',
    gutter: option.gutter,
    flex: option.flexbox
  });
  //format cycle based on fraction
  data.cycle = data.cycle === '1'
               ? data.fraction.split('').pop()
               : data.cycle;

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

  /**
   * This funk joins like elements before genChild since genChild
   * processes the element right away thus it will create eight
   * indv css keys/props rather than four, we want four
   */
  let childStore  = {};
  const createChild = function (elmKey, css) {
    childStore = _.defaultsDeep(childStore, {[elmKey]: css});
  };


  const gut = data.gutter;
  const cylcle = data.cycle;
  //return res
  const res = {};
  //same for all
  const getSize = _L.getSize(data.gutter, data.fraction);
  res.width = getSize;
  res.height = getSize;

  //flexbox
  if (data.flex) {
    res.flex = [0, 0, 'auto'];
    if (option.rtl) {
      createChild('nth-child(n)', {'margin-left': gut});
      createChild('nth-child(' + cylcle + 'n)', {'margin-left': 0});
      createChild('last-child', {'margin-left': 0});
    }else {
      createChild('nth-child(n)', {'margin-right': gut});
      createChild('nth-child(' + cylcle + 'n)', {'margin-right': 0});
      createChild('last-child', {'margin-right': 0});
    }
  }else if (option.rtl) {
    createChild('nth-child(n)', {
      'margin-left': gut,
      float: 'right',
      clear: 'none'
    });
    createChild('last-child', {'margin-left': 0});
    createChild('nth-child(' + cylcle + 'n)', {'margin-left': 0});
    createChild('nth-child(' + cylcle + 'n+1)', {clear: 'rigth'});
  }else {
    createChild('nth-child(n)', {
      'margin-right': gut,
      float: 'left',
      clear: 'none'
    });
    createChild('last-child', {'margin-right': 0});
    createChild('nth-child(' + cylcle + 'n)', {'margin-right': 0});
    createChild('nth-child(' + cylcle + 'n+1)', {clear: 'left'});
  }

  //common
  createChild('nth-child(n)', {'margin-bottom': gut});
  createChild('last-child', {'margin-bottom': 0});
  createChild('nth-last-child(-n+' + cylcle + ')', {'margin-bottom': 0});

  //cycfle childStore to process elm tmpls
  _.forEach(childStore, function (val, key) {
    genChild(key, val);
  });

  return res;
};

module.exports = column;
