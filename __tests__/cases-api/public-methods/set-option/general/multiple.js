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

//base -> no option
ctr.create('.test-1', base);

ctr.setOption({
  hover: {
    duration: '10s'
  }
});

// dur: 10s
ctr.create('.test-2', base);

ctr.setOption({
  hover: {
    delay: '20s'
  }
});

// dur: 10s, delay: 20s
ctr.create('.test-3', base);

ctr.setOption({
  hover: {
    ease: 'ease-out'
  }
});

//should at this point have all the optiosn
// dur: 10s, delay: 20s, ease: ease-out
ctr.create('.test-4', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
