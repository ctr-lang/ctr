const CTR  = require('ctr').js;
const ctr  = new CTR();

// add the class
ctr.setClass('box', {
  width: '250px',
  height: '250px'
});

ctr.create('.test', {
  color: 'red',
  // will merge in box class
  extend: 'box'
});

const res = ctr.getRes();

module.exports = {
  res: res
};
