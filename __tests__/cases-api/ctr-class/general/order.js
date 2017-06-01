const CTR  = require('ctr').js;
const ctr  = new CTR();

// add the class
ctr.setClass('box', {
  width: '250px',
  height: '250px'
});

ctr.setClass('box-red', {
  //box trumps
  width: '999px',
  height: '999px',
  background: '#f00'
});


ctr.create('.test', {
  // multiple classes
  extend: {
    class: ['box', 'box-red']
  }
});


const res = ctr.getRes();

module.exports = {
  res: res
};
