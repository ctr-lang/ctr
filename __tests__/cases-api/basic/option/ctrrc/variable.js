const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
variable:
  duration: 10s
  size: 800px

option:
  hover:
    ease: ease-out
  global:
    sort: -len`);
const ctr  = new CTR();

const res = ctr.create('.test', {
  size: '$size$',
  hover: {
    on: {
      width: '400px',
      option: {
        duration: '$duration$'
      }
    }
  }
}).getResult();


module.exports = {
  res: res
};
