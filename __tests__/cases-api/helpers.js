const fs     = require('fs');
const path   = require('path');

/**
 * Reads css file
 * @param  {---} lookup -> dir or file name
 * @param  {str} file      -> if dir need to specify file to lookup
 * @return {str}           -> css str
 */
const readFile = function (lookup, file) {
  return !file
          //file
         ? fs.readFileSync(lookup.replace(/\.js/, '.css'), 'utf-8').replace(/\r/g, '').trim()
         //dir
         : fs.readFileSync(path.join(lookup, file), 'utf-8').replace(/\r/g, '').trim();
};

/**
 * Removes extra space from css
 * @param  {str} css -> css to clean
 * @return {str}     -> css cleaned
 */
const cleanCSS = function (css) {
  return css.replace(/\r/g, '').trim();
};

module.exports = {
  readFile,
  cleanCSS
};
