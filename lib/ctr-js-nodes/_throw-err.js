const colors    = require('colors');

/**
 * Private -> error message helper
 */
const _throwErr = function({error, msg, location = false, errLoc = false, format = true}) {
  const self = this;
  colors.setTheme({
    data: ['gray', 'bold'],
    error: ['red', 'underline', 'bold']
  });
  console.warn('~!!!~ ctr error ~!!!~'.error);
  console.warn('Type     |=> '.data, error, ' error... ', '(╯︵╰,)'.magenta.bold);
  console.warn('Location |=> '.data, location ? location : self._selector.length ? self._selector : `Sorry, I'm not sure`);
  console.warn('Message  |=> '.data, format ? msg.replace(/\s{2,}/gm, ' ') : msg);
  if (errLoc) {
    console.warn('Err Loc  |=> '.data, errLoc ? errLoc.replace(/\s{2,}/gm, ' ') : errLoc);
  }
};

module.exports = _throwErr;
