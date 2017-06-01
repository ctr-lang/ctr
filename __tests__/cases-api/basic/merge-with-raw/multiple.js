const CTR  = require('ctr').js;
const ctr  = new CTR();

const hoverOne = {
  'hover-non': {
    width: '100px'
  }
};
const hoverTwo = {
  'hover-on': {
    width: '200px'
  }
};

ctr.create('.test', {
  background: 'black',
  //multiple merge
  mergeWith: [hoverOne, hoverTwo],
  //will be merged into
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
