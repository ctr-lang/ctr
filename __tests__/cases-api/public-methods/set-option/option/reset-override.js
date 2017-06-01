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

//base -> no options
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

//resets the option to new object
ctr.setOption({
  //set to new
  hover: {
    duration: '420s'
  }
}, {
  reset: true
});

//should only have the option of 420s
ctr.create('.test-3', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
