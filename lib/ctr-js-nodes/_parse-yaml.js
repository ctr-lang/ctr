const fs   = require('fs');
const yaml = require('js-yaml');

/**
 * Private -> Wrapper helper to read the yaml file
 * @param  {---}  filePath -> string or buffer of yaml
 * @param  {bln} buffer    -> if it is a buffer
 * @return {---}           -> js object or false if failed
 */
const _parseYaml = function (filePath, buffer = false, option = {}) {
  const self = this;
  const loadType = option.safe || option.loadSafe ? 'safeLoad' : 'load';
  try {
    if (buffer) {
      return yaml[loadType](filePath);
    }
    return yaml[loadType](fs.readFileSync(filePath));
  }catch (err) {
    //throw error
    self.error = {
      error: 'YAML parse',
      msg: err.reason,
      location: filePath,
      errLoc: err.message,
      format: false
    };
    self._throwErr(self.error);
    return false;
  }
};

module.exports = _parseYaml;
