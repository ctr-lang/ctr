const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
$var$:
  duration: 10s
  size: 800px`);
const ctr  = new CTR();
//change key
ctr.localVarKey = '$var$';

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
