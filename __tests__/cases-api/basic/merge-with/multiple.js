const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  on: {
    width: '200px'
  },
  non: {
    width: '100px'
  }
});

ctr.create('.test', {
  background: 'black',
  //multiple merge
  //will be merged into
  hover: {
    mergeWith: ['$on$', '$non$'],
    on: {
      option: {
        duration: '2s'
      },
      height: '200px'
    },
    non: {
      option: {
        duration: '1s'
      },
      height: '100px'
    }
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
