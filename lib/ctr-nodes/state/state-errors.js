const _H = require('../helpers/helper-index.js');

module.exports = function (err, data) {
  if (err === 'noKey') {
    _H.throwErr({
      type: 'No `State` Key Found',
      code: data,
      msg: ['I was unable to find a key to use in your `state` object',
            'so for the time being I will default to the key of `stateNotFound`'].join(' ')
    });
  }
};
