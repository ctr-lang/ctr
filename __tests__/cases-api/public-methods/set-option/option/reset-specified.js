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

ctr.setOption({
  hover: {
    duration: '10s'
  }
});

ctr.setOption({
  hover: {
    delay: '10s',
    ease: 'ease-out'
  }
});


//should have options
ctr.create('.test-1', base);


//reset options, and replace with new
ctr.setOption({
  reset: {
    hover: {
      duration: '22s'
    }
  }
});


ctr.create('.test-2', base);


//reset options, completely, no options -> empty obj
ctr.setOption({
  reset: {}
});


ctr.create('.test-3', base);

const res = ctr.getRes();

module.exports = {
  res: res
};
