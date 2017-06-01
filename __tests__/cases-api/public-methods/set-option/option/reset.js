const CTR  = require('ctr').js;
const ctr  = new CTR();

const base = {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
};

//base -> no optiosn
ctr.create('.test-1', base);

ctr.setOption({
  hover: {
    duration: '10s',
    delay: '10s',
    ease: 'ease-out'
  }
});

//should have above options
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
