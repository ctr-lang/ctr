const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setOption({
  classLock: false
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

// overwrite class
ctr.setClass('box', {
  width: '500px',
  height: '500px'
}, {overwrite: true});

ctr.create('.test-2', {
  color: 'red',
  extend: 'box'
});


const res = ctr.getRes();

module.exports = {
  res: res
};
