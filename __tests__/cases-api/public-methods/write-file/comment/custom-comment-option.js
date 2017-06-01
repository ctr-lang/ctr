const _h   = require('./../_helpers.js');
const CTR = require('ctr').js;
const ctr  = new CTR();

/*
Helpers
 */
const rmvFile  = _h.rmvFile;
const readFile = _h.readFile;

//gen path of css file
const cssPath = __filename.replace('.js', '.css');

//remove file if it exsits
rmvFile(cssPath);

//create and wrtie css file
ctr.create('.test', {
  width: '200px'
}).writeFile({
  comment: '/*My custom comment, yo!*/'
});

const res = readFile(__filename.replace('.js', '.css'));
const exp = readFile(__filename.replace('.js', '.exp.css'));

module.exports = {
  res: res,
  exp: exp
};
