const CTR  = require('ctr').js;
const ctr  = new CTR();

// add the class
ctr.setClass('box', {
  width: '250px',
  height: '250px'
});
// overwrite class
ctr.setClass('box', {
  width: '500px',
  height: '500px'
}, {overwrite: true});

ctr.create('.test', {
  color: 'red',
  // will merge in box class
  extend: {
    class: 'box'
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
