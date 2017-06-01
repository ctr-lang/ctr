const _         = require('lodash');
const Immutable = require('immutable');
const throwErr  = require('./helper-throw-err.js');

/**
 * Align self helper
 * @param  {map} staticArgs -> static args
 * @param  {str} loc        -> location
 * @return {map}            -> static args
 */
const alignSelf = function (staticArgs, loc) {
  if (_.includes(['horizontal', 'hr'], loc)) {
    return Immutable.fromJS({
      top: 'auto',
      right: 'auto',
      bottom: 'auto',
      left: '50%',
      transform: 'translate(-50%, 0)',
      position: 'absolute'
    }).merge(staticArgs);
  }else if (_.includes(['vertical', 'vr'], loc)) {
    return Immutable.fromJS({
      top: '50%',
      right: 'auto',
      bottom: 'auto',
      left: 'auto',
      transform: 'translate(0, -50%)',
      position: 'absolute'
    }).merge(staticArgs);
  }else if (_.includes(['top-left', 'tl'], loc)) {
    return Immutable.fromJS({
      top: '0',
      right: 'auto',
      bottom: 'auto',
      left: '0',
      transform: 'translate(0, 0)',
      position: 'absolute'
    }).merge(staticArgs);
  }else if (_.includes(['top', 'top-center', 'tc'], loc)) {
    return Immutable.fromJS({
      top: '0',
      right: 'auto',
      bottom: 'auto',
      left: '50%',
      transform: 'translate(-50%, 0)',
      position: 'absolute'
    }).merge(staticArgs);
  }else if (_.includes(['top-right', 'tr'], loc)) {
    return Immutable.fromJS({
      top: '0',
      right: '0',
      bottom: 'auto',
      left: 'auto',
      transform: 'translate(0, 0)',
      position: 'absolute'
    }).merge(staticArgs);
  }else if (_.includes(['left', 'center-left', 'cl'], loc)) {
    return Immutable.fromJS({
      top: '50%',
      right: 'auto',
      bottom: 'auto',
      left: '0',
      transform: 'translate(0, -50%)',
      position: 'absolute'
    }).merge(staticArgs);
  } else if (_.includes(['right', 'center-right', 'cr'], loc)) {
    return Immutable.fromJS({
      top: '50%',
      right: '0',
      bottom: 'auto',
      left: 'auto',
      transform: 'translate(0, -50%)',
      position: 'absolute'
    }).merge(staticArgs);
  }else if (_.includes(['bottom-left', 'bl'], loc)) {
    return Immutable.fromJS({
      top: 'auto',
      right: 'auto',
      bottom: '0',
      left: '0',
      transform: 'translate(0, 0)',
      position: 'absolute'
    }).merge(staticArgs);
  }else if (_.includes(['bottom', 'bottom-center', 'bc'], loc)) {
    return Immutable.fromJS({
      top: 'auto',
      right: 'auto',
      bottom: '0',
      left: '50%',
      transform: 'translate(-50%, 0)',
      position: 'absolute'
    }).merge(staticArgs);
  }else if (_.includes(['bottom-right', 'br'], loc)) {
    return Immutable.fromJS({
      top: 'auto',
      right: '0',
      bottom: '0',
      left: 'auto',
      transform: ' translate(0, 0)',
      position: 'absolute'
    }).merge(staticArgs);
  }else if (_.includes(['center', 'middle', true], loc)) {
    return Immutable.fromJS({
      top: '50%',
      right: 'auto',
      bottom: 'auto',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      position: 'absolute'
    }).merge(staticArgs);
  }

  //error
  throwErr({
    type: 'Invalid "align" key',
    code: JSON.stringify(staticArgs.toJS()),
    msg: '"' + loc + '" ---> is not a valid align value.'
  });

  return staticArgs;
};

module.exports = alignSelf;
