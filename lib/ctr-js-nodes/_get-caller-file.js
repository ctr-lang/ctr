
/**
 * Private -> called by writeFile to autogen a path from the Error stack
 * @return {str} -> caller path
 */
const _getCallerFile = function () {
  const self = this;
  const originalFunc = Error.prepareStackTrace;
  let callerfile = 'prepare-stack-trace-error';
  try {
    const err = new Error();
    Error.prepareStackTrace = function (_err, stack) { return stack; };
    const currentfile = err.stack.shift().getFileName();
    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName();
      if(currentfile !== callerfile) { break; }
    }
  } catch (err) {
    //throw not found
    self._throwErr({
      error: 'Prepare Stack Trace',
      msg: err
    });
  }
  Error.prepareStackTrace = originalFunc;
  return callerfile;
};

module.exports = _getCallerFile;
