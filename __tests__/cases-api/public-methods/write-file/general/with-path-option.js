const _h   = require('./../_helpers.js');
const CTR = require('ctr').js;
const ctr  = new CTR();

/*
Helpers
 */
const rmvFile  = _h.rmvFile;
const readFile = _h.readFile;

//gen path of css file
const cssPath = __filename.replace('.js', '.ctr.css');

//remove file if it exsits
rmvFile(cssPath);


//create and wrtie css file
ctr.create('.test', {
  width: '200px'
}).writeFile({
  filePath: cssPath
});


//get and read write file
const res = readFile(cssPath);
const exp = readFile(__filename.replace('.js', '.exp.css'));

module.exports = {
  res: res,
  exp: exp
};
