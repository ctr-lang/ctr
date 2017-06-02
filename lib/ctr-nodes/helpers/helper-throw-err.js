const _M         = require('../manager/manager-index.js');

const throwErr = function (errData) {
  //set global error for ctr.js ref
  global._ctrNodeError_ = true;
  //get reff
  const errRef = _M._option.getIn(['errRef']);
  if (errRef.error === true) { return; }
  const id = errRef.id;
  const type = errData.type;
  const exp = errData.exp;
  let rec = errData.rec;
  let code = errData.code;
  let msg = errData.msg;
  // colors.setTheme({
  //   info: 'green',
  //   data: ['gray', 'bold'],
  //   warn: ['yellow', 'bold'],
  //   error: ['red', 'underline', 'bold']
  // });

  console.info('~!!!~ ctr error ~!!!~');
  console.info('Type     |=> ', 'A ', type, ' error... ', '(╯︵╰,)');
  console.info('Location |=> ', id);
  //error types
  if (type === 'Syntax') {
    rec = typeof rec;
    console.info('Info     |=> ', `I expected a ${exp} but got a ${rec}`);
    console.info('Code Ref |=> ', code);
    code = null;
  }

  if (code) {
    console.info('Code Ref |=> ', code);
  }
  //aux message
  if (msg) {
    if (msg === 'default') {
      msg = 'For your convince I will just use the set defaults.';
    }
    console.info('Message  |=> ', msg);
  }
};

module.exports = throwErr;
