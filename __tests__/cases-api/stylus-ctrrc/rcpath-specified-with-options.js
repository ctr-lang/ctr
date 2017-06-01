const fs     = require('fs');
const path   = require('path');
const stylus = require('stylus');
const del    = require('del');
const ctr    = require('ctr').stylus;

//helper
const readFile = function (_path) {
  return fs.readFileSync(_path, 'utf-8').replace(/\r/g, '').trim();
};

const customRcPath = path.join(__dirname, '/.testRcPath.yml');

//write ctrrc
fs.writeFileSync(customRcPath, `
ctrOption:
  hover:
    delay: 22s
    duration: 11s`);


//get files
const styl = readFile(path.join(__dirname, 'rcpath-specified-with-options.styl'));

//set stylus
const res = stylus(styl).use(ctr({
  rcPath: customRcPath,
  hover: {
    ease: 'ease-in',
    //should NOT overwrite ctryml
    delay: '33s'
  }
})).render();

del.sync(customRcPath);

module.exports = {
  res: res
};
