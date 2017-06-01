const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
option:
  hover:
    duration: 420s`);

const ctr  = new CTR();

const base = {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
};

//base style, will have rc options -> 420s
ctr.create('.test-1', base);


//reset options, completely, disregard rc base
ctr.setOption({
  reset: true,
  ctrrc: false
});

//should be at defults
ctr.create('.test-2', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
