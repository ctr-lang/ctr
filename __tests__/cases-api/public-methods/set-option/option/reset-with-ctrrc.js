const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
ctrOption:
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

//only option should be rc -> 420
ctr.create('.test-1', base);

//overwrite ctrrc
ctr.setOption({
  hover: {
    duration: '10s'
  }
}, {
  overwrite: true
});

//merge in new option, no need to overwrite since not specified yet
ctr.setOption({
  hover: {
    ease: 'ease-out'
  }
});

//should have dur: 10s + ease-out
ctr.create('.test-2', base);

//resets the option
ctr.setOption({
  reset: true
});

//should === .test-1
ctr.create('.test-3', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
