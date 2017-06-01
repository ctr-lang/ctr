const CTR  = require('ctr').js;
const ctr  = new CTR();

const baseStyle = {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
};

//base -> no options
ctr.create('.test1', baseStyle);

//set options
ctr.setOption({
  hover: {
    duration: '10s',
    ease: 'ease-out',
    delay: '10s'
  }
});

//should have options
ctr.create('.test2', baseStyle);

//reset options, but only once, and use new option
ctr.setOption({
  hover: {
    duration: '22s'
  }
}, {
  reset: true,
  once: true
});

//duration should be 22, everthing else reset
ctr.create('.test3', baseStyle);

//should === .test2
ctr.create('.test4', baseStyle);


const res = ctr.getRes();


module.exports = {
  res: res
};
