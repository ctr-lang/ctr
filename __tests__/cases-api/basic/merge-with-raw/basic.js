const CTR  = require('ctr').js;
const ctr  = new CTR();

const option = {
  option: {
    duration: '1s'
  }
};


ctr.create('.test', {
  background: 'black',
  hover: {
    //merge in options, keeps option key
    mergeWith: option,
    on: {
      width: '200px'
    },
    non: {
      width: '100px'
    }
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
