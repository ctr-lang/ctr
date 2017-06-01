const _M         = require('../manager/manager-index.js');
const colors     = require('colors');

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
  colors.setTheme({
    info: 'green',
    data: ['gray', 'bold'],
    warn: ['yellow', 'bold'],
    error: ['red', 'underline', 'bold']
  });

  console.info('~!!!~'.america, 'ctr error'.error, '~!!!~'.america);
  console.info('Type     |=> '.data, 'A ', type.error, ' error... ', '(╯︵╰,)'.magenta.bold);
  console.info('Location |=> '.data, id);
  //error types
  if (type === 'Syntax') {
    rec = typeof rec;
    console.info('Info     |=> '.data, 'I expected a ', exp, ', but got a ', rec);
    console.info('Code Ref |=> '.data, code);
    code = null;
  }

  if (code) {
    console.info('Code Ref |=> '.data, code);
  }
  //aux message
  if (msg) {
    if (msg === 'default') {
      msg = 'For your convince I will just use the set defaults.';
    }
    console.info('Message  |=> '.data, msg);
  }
};

module.exports = throwErr;
