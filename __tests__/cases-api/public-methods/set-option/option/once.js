const CTR  = require('ctr').js;
const ctr  = new CTR();

const base = {
  width: '200px',
  'hover-on': {
    height: '400px'
  }
};

//base
ctr.create('.test-1', base);

//set dur, but only apply it once
ctr.setOption({
  hover: {
    duration: '10s'
  }
}, {once: true});

//should have dur: 10s
ctr.create('.test-2', base);

// should === .test-1
ctr.create('.test-3', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
