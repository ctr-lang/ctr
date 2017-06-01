const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
option:
  hover:
    delay: 22s
    duration: 11s
    ease: ease-out`);

const ctr  = new CTR();

const base = {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
};

//should have 11s and ease-out
ctr.create('.test-1', base);


//reset options, reset, deepmereges so ease + delay should still be preset
//but duration changed
ctr.setOption({
  hover: {
    duration: '22s'
  }
}, {
  reset: true
});

//dur: 22s
ctr.create('.test-2', base);

//reset back to base -> ctrrc
ctr.setOption({reset: true});

//reset back to normal, should == .test-1
ctr.create('.test-3', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
