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

//no options
ctr.create('.test-1', base);

//set option
ctr.setOption({
  hover: {
    duration: '10s',
    delay: '20s',
    ease: 'ease-in'
  }
});

//has above options
ctr.create('.test-2', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
