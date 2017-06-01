const _H = require('../helpers/helper-index.js');

module.exports = function (err, dataObj) {
  if (err === 'syntax') {
    _H.throwErr({
      type: 'Syntax',
      exp: dataObj.exp,
      rec: dataObj.rec,
      code: dataObj.code,
      msg: dataObj.msg
    });
  }else if (err === 'notFound') {
    _H.throwErr({
      type: 'Not Found',
      code: dataObj.code,
      msg: dataObj.msg
    });
  }else if (err === 'format') {
    _H.throwErr({
      type: 'Format',
      code: dataObj.code,
      msg: dataObj.msg
    });
  }
};
