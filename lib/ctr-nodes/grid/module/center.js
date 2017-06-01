const _             = require('lodash');
const Immutable     = require('immutable');
const flexContainer = require('./flex-container.js');
const _L            = require('./grid-helpers.js');
const _M            = require('./../../manager/manager-index.js');
const _H            = require('./../../helpers/helper-index.js');

/**
 * Horizontally center a container element and apply padding to it.
 *
 * @param {unit} [$max-size=1140px] - A max-width to assign. Can be any unit.
 * @param {unit} [$pad=0] - Padding on the left and right of the element. Can be any unit.
 * @param {boolean} [$flex=$flexbox] - Determines whether this element should use Flexbox or not.
 *
 * @example
 *   section
 *     center(900px)
 */
const center = function (data, option, target) {
  //get media break points to set default to lg
  const mediaBP = _M._option.getIn(['media']);

  //convert array data into obj
  data = _.isString(data) || data === true ? [data] : data;
  //asing props
  if (_.isArray(data)) {
    data = _.reduce(data, function (prv, val, index) {
      if (index === 0) { prv.max = val; }
      if (index === 1) { prv.pad = val; }
      if (index === 2) { prv.flex = val; }
      return prv;
    }, {});
  }

  //check if user is reffrencing mediaBP in data
  if (_.isString(data.max)) {
    _.forEach(mediaBP, function (val, key) {
      if (data.max === key) {
        data.max = val;
      }
    });
  }

  //check for true and assign lg
  data.max = data.max === true ? mediaBP.lg : data.max;

  //format data
  data = _L.formatData(data, {
    max: mediaBP.lg || '1140px',
    pad: '0',
    flex: option.flexbox
  });
  const res = {};
  if (data.pad !== '0') {
    res['padding-left'] = data.pad;
    res['padding-right'] = data.pad;
  }
  res['max-width'] = data.max;
  res['margin-left'] = 'auto';
  res['margin-right'] = 'auto';

  if (data.flex) {
    //wes got to add on the flex containre data
    return flexContainer(data, res, 'row');
  }
  //we gotta throw this bitch all the way back to clearfix
  //and thus processe it seperatly then
  let staticMap = Immutable.Map(res);
  staticMap = staticMap.set('clearfix', true);

  _H.clearfix(staticMap, target, true);
};

module.exports = center;
