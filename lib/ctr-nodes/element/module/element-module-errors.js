const _H = require('../../helpers/helper-index.js');

module.exports = function (err, data) {
  if (err === 'noKey') {
    _H.throwErr({
      type: 'No `Element` Key Found',
      code: data,
      msg: ['I was unable to find a key to use in your `element` object',
            'so for the time being I will default to the key of `elementNotFound`'].join(' ')
    });
  }else if (err === 'duplicate') {
    _H.throwErr({
      type: 'Duplicate Key',
      code: data,
      msg: ['It looks like we have a duplicate key captain and thats something',
            'I can not handle so I will just ignore the duplicate key'].join(' ')
    });
  }else if (err === 'family-args')  {
    _H.throwErr({
      type: 'Element -> family helper',
      code: `Expected format: ${data.exp}  -> got: ${data.raw}`,
      msg: ['Got the  wrong number of arguments to make magic with'].join(' ')
    });
  }else if (err === 'format')  {
    _H.throwErr({
      type: 'Element -> family helper',
      code: `Expected format: ${data.exp}  -> got: ${data.raw}`,
      msg: ['yo dawg I need Numbers arguments to make magic'].join(' ')
    });
  }

};
