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


let writePath;
//create and wrtie css file
ctr.create('.test', {
  width: '200px'
}).writeFile({
  callback: function (_writePath) {
    //this is the ctr ref
    //set write path
    writePath = _writePath;
    return this.res;
  }
});

const res = readFile(__filename.replace('.js', '.css'));
const exp = readFile(writePath.replace('.js', '.exp.css'));

module.exports = {
  res: res,
  exp: exp
};
