const _  = require('lodash');
const _M = require('../manager/manager-index.js');


module.exports = function (data) {
  //sorts keys for better readablity
  const sortKeys = function (obj) {
    const keys = _.sortBy(_.keys(obj), function (key) {
      return key;
    });
    return _.zipObject(keys, _.map(keys, function (key) {
      return obj[key];
    }));
  };

  //remove stlye
  data = _.omit(data, ['style', 'buttron']);
  let res = _.defaults(data, {
    height: '60px',
    border: 'initial'
  });
  //@TODO fuck line-height??
  const lineHeight = res.height;


  res = _.defaults(data, {
    background: '#2196f3',
    color: '#fff',
    position: 'relative',
    width: '200px',
    margin: '0rem',
    padding: '0rem',
    'border-radius': '4px',
    'box-shadow': 'initial',
    'font-size': '1rem',
    'font-weight': 'initial',
    'font-family': 'initial',
    'text-align': 'center',
    'text-decoration': 'none',
    'vertical-align': 'middle',
    'line-height': lineHeight,
    cursor: 'pointer',
    overflow: 'hidden',
    'z-index': 0,
    transform: 'translateZ(0)'
  });

  //sort keys
  res = sortKeys(res);

  //add font-smoothing
  if (_M._option.getIn(['global', 'fontSmoothing'])) {
    res = _.defaults(res, {
      'backface-visibility': 'hidden',
      '-webkit-backface-visibility': 'hidden',
      '-moz-osx-font-smoothing': 'grayscale'
    });
  }

  return res;
};
