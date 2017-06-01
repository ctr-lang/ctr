const _H = require('../helpers/helper-index.js');

module.exports = function (err, dataObj) {
  if (err === 'catchAll') {
    _H.throwErr({
      type: 'Catch-all',
      code: {align: dataObj},
      msg: ['Your, grid align property hit the catch-all which is "center". My guess',
            `is that you misspelled: "${dataObj}", becuase heaven knows I do all the time.`].join(' ')
    });
  }
};
