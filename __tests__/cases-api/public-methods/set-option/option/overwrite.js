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

//base option
ctr.setOption({
  hover: {
    duration: '10s',
    delay: '10s'
  }
});

//should have set base options
ctr.create('.test-1', base);

//ease should succsed but duration fail
ctr.setOption({
  hover: {
    //succsed
    ease: 'ease-out',
    //fail
    duration: '20s'
  }
});

//should equal .test-1 but with ease-out
ctr.create('.test-2', base);

//both will change
ctr.setOption({
  hover: {
    ease: 'ease-in',
    duration: '20s'
  }
}, {
  overwrite: true
});


//should have ease-in and 20s
ctr.create('.test-3', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
