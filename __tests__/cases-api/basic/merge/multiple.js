const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  'hover-one': {
    'hover-on': {
      width: '200px'
    }
  },
  'hover-two': {
    'hover-non': {
      width: '100px'
    }
  }
});

ctr.create('.test', {
  background: 'black',
  //multiple merge
  merge: ['$hover-one$', '$hover-two$'],
  'hover-on': {
    option: {
      duration: '2s'
    },
    height: '200px'
  },
  'hover-non': {
    option: {
      duration: '1s'
    },
    height: '100px'
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
