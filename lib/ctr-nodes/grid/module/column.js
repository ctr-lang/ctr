const _         = require('lodash');
const Immutable = require('immutable');
const _L        = require('./grid-helpers.js');
const _M        = require('../../manager/manager-index.js');

/**
 * Creates a column that is a fraction of the size of it's containing element
 * with a gutter. You don't need to pass any additional ratios (fractions) as
 * the grid system will make use of calc().
 * Note that fractions must always be wrapped in quotes.
 *
 * @param {string} [$fraction='1/1']
 *  This is a simple fraction of the containing element's width.
 *  This must be a string written as a fraction.
 * @param {number} [$cycle=convert(unquote(split('/', $fraction)[1]))]
 *  Lost works by assigning a margin-right to all elements except the last in
 *  the row. It does this by default by using the denominator of the fraction
 *  you pick. To override this default use this param. e.g. column('2/4', $cycle: 2)
 * @param {number} [$gut=$gutter] - The margin on the right side of the element
 *  used to create a gutter. Typically this is left alone and the global $gutter
 *  will be used, but you can override it here if you want certain elements to
 *  have a particularly large or small gutter (pass 0 for no gutter at all).
 * @param {boolean} [$flex=$flexbox] - Determines whether this element should
 *  use Flexbox or not.
 *
 * @example
 *   figure
 *     column('1/3')
 */

const column = function (data, option, target) {
  //return res
  const res = {};
  //check for none value
  const none = data === 'none' || data.none;

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

    _M._queue.add(Immutable.Map({
      data: dataMap,
      target: target
    }), {
      processNow: true
    });
  };


  /**
   * This funk joins like elements before genChild since genChild
   * processes the element right away
   */
  let childStore  = {};
  const createChild = function (elmKey, css) {
    childStore = _.defaultsDeep(childStore, {[elmKey]: css});
  };


  // none value reste
  if (none) {
    //set root res
    res.width = 'auto';
    //gen children
    const noneChildren = ['last-child', 'nth-child(n)', 'nth-child(1n+1)', 'nth-child(1n)'];
    const noneChildData = {
      float: 'none',
      clear: 'none',
      'margin-right': 0,
      width: 'auto'
    };

    //cylce childrend with data to gen
    _.forEach(noneChildren, function (val) {
      genChild(val, noneChildData);
    });

    return res;
  }

  data = _L.formatData(data, {
    fraction: '1/1',
    cycle: '0',
    gutter: option.gutter,
    flex: option.flexbox
  });

  //convert raw num into strings
  data.cycle = _.isString(data.cycle) ? data.cycle : data.cycle.toString();

  //format cycle based on fraction
  data.cycle = data.cycle === '0'
               ? data.fraction.split('').pop()
               : data.cycle;

  const gut = data.gutter === false ? '0' : data.gutter;
  let cycle = data.cycle === false ? '0' : data.cycle;
  cycle = cycle.replace ? cycle.replace(' ', '') : cycle;
  //with is the same for all
  res.width = _L.getSize(gut, data.fraction);

  //flexbox
  if (data.flex) {
    res.flex = [0, 0, 'auto'];
    if (option.rtl) {
      if (data.fraction !== '1/1' && cycle !== '1') {
        createChild('nth-child(1n)', {'margin-left': gut});
      }
      createChild('last-child', {'margin-left': '0'});
      createChild('nth-child(' + cycle + 'n)', {
        float: 'left',
        'margin-left': '0'
      });
    }else {
      if (data.fraction !== '1/1' && cycle !== '1') {
        createChild('nth-child(1n)', {'margin-right': gut});
      }
      createChild('last-child', {'margin-right': '0'});
      createChild('nth-child(' + cycle + 'n)', {
        float: 'right',
        'margin-right': '0'
      });
    }
  }else if (option.rtl) {
    createChild('nth-child(n)', {
      'margin-left': gut,
      float: 'right',
      clear: 'none'
    });
    createChild('last-child', {
      'margin-left': 0
    });
    createChild('nth-child(' + cycle + 'n)', {
      'margin-left': 0,
      float: 'left'
    });
    createChild('nth-child(' + cycle + 'n+1)', {
      clear: 'rigth'
    });
  }else {
    createChild('nth-child(1n)', {
      'margin-right': gut,
      float: 'left',
      clear: 'none'
    });
    createChild('last-child', {
      'margin-right': 0
    });
    if (cycle !== '1') {
      createChild('nth-child(' + cycle + 'n)', {
        'margin-right': 0,
        float: 'right'
      });
    }
    createChild('nth-child(' + cycle + 'n+1)', {
      clear: 'left'
    });
  }

  //cycfle childStore to process elm tmpls
  _.forEach(childStore, function (val, key) {
    genChild(key, val);
  });

  return res;
};

module.exports = column;
