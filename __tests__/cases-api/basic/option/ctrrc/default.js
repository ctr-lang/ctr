const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
hover:
  duration: 20s
global:
  sort: -len`);
const ctr  = new CTR();

const res = ctr.create('.test', {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
}).getResult();


module.exports = {
  res: res
};
