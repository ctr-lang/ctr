// const colors    = require('colors');

/**
 * Private -> error message helper
 */
const _throwErr = function({error, msg, location = false, errLoc = false, format = true}) {
  const self = this;
  // colors.setTheme({
  //   data: ['gray', 'bold'],
  //   error: ['red', 'underline', 'bold']
  // });
  console.info('~!!!~ ctr error ~!!!~');
  console.info('Type     |=> ', error, ' error... ', '(╯︵╰,)');
  console.info('Location |=> ', location ? location : self._selector.length ? self._selector : `Sorry, I'm not sure`);
  console.info('Message  |=> ', format ? msg.replace(/\s{2,}/gm, ' ') : msg);
  if (errLoc) {
    console.info('Err Loc  |=> ', errLoc ? errLoc.replace(/\s{2,}/gm, ' ') : errLoc);
  }
};

module.exports = _throwErr;
