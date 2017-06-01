const CTR  = require('ctr').js;

// instance options should trump
const ctr = new CTR({
  variable: {
    duration: '20s',
    size: '800px'
  },
  option: {
    hover: {
      ease: 'ease-in'
    }
  }
});

const base = {
  size: '$size$',
  hover: {
    on: {
      width: '400px',
      option: {
        duration: '$duration$'
      }
    }
  }
};

//base
ctr.create('.test-1', base);

//set options should trump, need to overwrite since ease
//was defined in instance rc
ctr.setOption({
  hover: {
    ease: 'ease-out'
  }
}, {overwrite: true});

//oder should be -len, create options aways trump
ctr.create('.test-2', base, {
  global: {
    sort: '-len'
  }
});

//get res
const res = ctr.getRes();

module.exports = {
  res: res
};
