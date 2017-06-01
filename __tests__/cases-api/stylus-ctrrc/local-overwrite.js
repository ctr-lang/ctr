const fs     = require('fs');
const path   = require('path');
const stylus = require('stylus');
const ctr    = require('ctr').stylus;

//helper
const readFile = function (_path) {
  return fs.readFileSync(_path, 'utf-8').replace(/\r/g, '').trim();
};


//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
option:
  hover:
    delay: 2s
    duration: 10s`);


//get files
const styl = readFile(path.join(__dirname, 'local-overwrite.styl'));

//set stylus
const res = stylus(styl).use(ctr()).render();


module.exports = {
  res: res
};
