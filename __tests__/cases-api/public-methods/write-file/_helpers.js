const fs = require('fs');

/*
Helpers
 */
const rmvFile = function (cssPath) {
  //remove file if it exsits
  if (fs.existsSync(cssPath)) {
    fs.unlink(cssPath, function (err) {
      if (err) {
        throw err;
      }
    });
  }
};

const readFile = function (readPath) {
  const normalizeContent = function (str) {
    return str.replace(/\r/g, '').trim();
  };
  return normalizeContent(fs.readFileSync(readPath, 'utf-8'));
};


module.exports = {
  rmvFile: rmvFile,
  readFile: readFile
};
