const _         = require('lodash');
const Immutable = require('immutable');
const _L        = require('./grid-helpers.js');
const thrErr    = require('./../grid-errors.js');
const _M        = require('../../manager/manager-index.js');

/**
 * Align nested elements.
 *
 * @param {string} [$location=middle-center] - The position the nested element takes relative to the containing element.
 * @param {boolean} [$flex=$flexbox] - Determines whether this element should use Flexbox or not.
 *
 * - reset
 * - top-left
 * - top-center or top
 * - top-right
 * - middle-left or left
 * - middle-right or right
 * - bottom-left
 * - bottom-center or bottom
 * - bottom-right
 *
 * @example
 *   .parent
 *     align(right)
 *     width: 600px
 *     height: 400px
 *     .child
 *       width: 300px
 *       height: 150px
 */
const align = function (data, option, target) {
  data = _L.formatData(data, {
    location: data === false ? 'reset' : 'center',
    flex: option.flexbox
  });
  let notFound = false;
  const res = {};
  const loc = data.location;
  //an't this a bitch, what we gots to do is throw this back into the mix
  //as an componet with the key that star thing I don't know how to spell `*`
  let compRes = {};

  //flex
  if (data.flex) {
    res.display = 'flex';
    if (_.includes(['reset', false], loc)) {
      res.display = 'initial';
      res['align-items'] = 'inherit';
      res['justify-content'] = 'inherit';
    }else if (_.includes(['horizontal', 'hr'], loc)) {
      res['align-items'] = 'inherit';
      res['justify-content'] = 'center';
    }else if (_.includes(['vertical', 'vr'], loc)) {
      res['align-items'] = 'center';
      res['justify-content'] = 'inherit';
    }else if (_.includes(['top-left', 'tl'], loc)) {
      res['align-items'] = 'flex-start';
      res['justify-content'] = 'flex-start';
    }else if (_.includes(['top', 'top-center', 'tc'], loc)) {
      res['align-items'] = 'flex-start';
      res['justify-content'] = 'center';
    }else if (_.includes(['top-right', 'tr'], loc)) {
      res['align-items'] = 'flex-start';
      res['justify-content'] = 'flex-end';
    }else if (_.includes(['left', 'center-left', 'cl'], loc)) {
      res['align-items'] = 'center';
      res['justify-content'] = 'flex-start';
    } else if (_.includes(['right', 'center-right', 'cr'], loc)) {
      res['align-items'] = 'center';
      res['justify-content'] = 'flex-end';
    }else if (_.includes(['bottom-left', 'bl'], loc)) {
      res['align-items'] = 'flex-end';
      res['justify-content'] = 'flex-start';
    }else if (_.includes(['bottom', 'bottom-center', 'bc'], loc)) {
      res['align-items'] = 'flex-end';
      res['justify-content'] = 'center';
    }else if (_.includes(['bottom-right', 'br'], loc)) {
      res['align-items'] = 'flex-end';
      res['justify-content'] = 'flex-end';
    }else if (_.includes(['center', 'middle', true], loc)) {
      res['align-items'] = 'center';
      res['justify-content'] = 'center';
    }else {
      notFound = true;
      //throw if not found
      thrErr('catchAll', loc);
    }
  }else {
    //defualt
    res.position = 'relative';
    if (_.includes(['reset', false], loc)) {
      res.position = 'static';
      compRes = {
        position: 'static',
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: 'auto',
        transform: 'translate(0, 0)'
      };
    }else if (_.includes(['horizontal', 'hr'], loc)) {
      compRes = {
        top: 'auto',
        right: 'auto',
        bottom: 'auto',
        left: '50%',
        transform: 'translate(-50%, 0)'
      };
    }else if (_.includes(['vertical', 'vr'], loc)) {
      compRes = {
        top: '50%',
        right: 'auto',
        bottom: 'auto',
        left: 'auto',
        transform: 'translate(0, -50%)'
      };
    }else if (_.includes(['top-left', 'tl'], loc)) {
      compRes = {
        top: '0',
        right: 'auto',
        bottom: 'auto',
        left: '0',
        transform: 'translate(0, 0)'
      };
    }else if (_.includes(['top', 'top-center', 'tc'], loc)) {
      compRes = {
        top: '0',
        right: 'auto',
        bottom: 'auto',
        left: '50%',
        transform: 'translate(-50%, 0)'
      };
    }else if (_.includes(['top-right', 'tr'], loc)) {
      compRes = {
        top: '0',
        right: '0',
        bottom: 'auto',
        left: 'auto',
        transform: 'translate(0, 0)'
      };
    }else if (_.includes(['left', 'center-left', 'cl'], loc)) {
      compRes = {
        top: '50%',
        right: 'auto',
        bottom: 'auto',
        left: '0',
        transform: 'translate(0, -50%)'
      };
    } else if (_.includes(['right', 'center-right', 'cr'], loc)) {
      compRes = {
        top: '50%',
        right: '0',
        bottom: 'auto',
        left: 'auto',
        transform: 'translate(0, -50%)'
      };
    }else if (_.includes(['bottom-left', 'bl'], loc)) {
      compRes = {
        top: 'auto',
        right: 'auto',
        bottom: '0',
        left: '0',
        transform: 'translate(-50%, 0)'
      };
    }else if (_.includes(['bottom', 'bottom-center', 'bc'], loc)) {
      compRes = {
        top: 'auto',
        right: 'auto',
        bottom: '0',
        left: '50%',
        transform: 'translate(-50%, 0)'
      };
    }else if (_.includes(['bottom-right', 'br'], loc)) {
      compRes = {
        top: 'auto',
        right: '0',
        bottom: '0',
        left: 'auto',
        transform: ' translate(0, 0)'
      };
    }else if (_.includes(['center', 'middle', true], loc)) {
      compRes = {
        top: '50%',
        right: 'auto',
        bottom: 'auto',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      };
    }else {
      notFound = true;
      //throw if not found
      thrErr('catchAll', loc);
    }
    compRes.position = compRes.position || 'absolute';
  }

  if (!notFound) {
    //create data structor
    const dataMap = Immutable.fromJS({
      comp: {
        '*': compRes
      }
    });

    //add it the queue
    _M._queue.add(Immutable.Map({
      data: dataMap,
      target: target
    }), {
      processNow: true
    });
  }

  // if notFound do not reutn a result
  return !notFound ? res : {};
};

module.exports = align;
