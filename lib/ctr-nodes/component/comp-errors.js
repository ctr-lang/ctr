const _H = require('../helpers/helper-index.js');

module.exports = function (err, data) {
  if (err === 'noKey') {
    _H.throwErr({
      type: 'No `Component` Key Found',
      code: data,
      msg: ['I was unable to find a key to use in your `compoent` object',
            'so for the time being I will default to the key of `componentNotFound`'].join(' ')
    });
  }else if (err === 'duplicate') {
    _H.throwErr({
      type: 'Duplicate Key',
      code: data,
      msg: ['It looks like we have a duplicate key captain and thats something',
            'I can not handle so I will just ignore the duplicate key'].join(' ')
    });
  }

};
