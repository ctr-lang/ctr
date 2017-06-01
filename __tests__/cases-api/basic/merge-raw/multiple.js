const CTR  = require('ctr').js;
const ctr  = new CTR();

const hoverOne = {
  'hover-on': {
    width: '200px'
  }
};
const hoverTwo = {
  'hover-non': {
    width: '100px'
  }
};

ctr.create('.test', {
  background: 'black',
  //multiple merge
  merge: [hoverOne, hoverTwo],
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
