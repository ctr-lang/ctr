const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setOption({
  classLock: true
});

// add the class
ctr.setClass('box', {
  width: '250px',
  height: '250px'
});

ctr.create('.test-1', {
  color: 'red',
  extend: 'box'
});


// should not be able to overwrite classes
ctr.setClass('box', {
  width: '2222222px',
  height: '2222222px'
});

// should not be the same as test-1
ctr.create('.test-2', {
  color: 'red',
  extend: 'box'
});


const res = ctr.getRes();

module.exports = {
  res: res
};
