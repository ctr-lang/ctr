const CTR  = require('ctr').js;
const ctr  = new CTR();

// add the class
ctr.setClass('box', {
  width: '250px',
  height: '250px'
});

ctr.setClass('hover-red', {
  hover: {
    on: {
      background: '#f00'
    },
    non: {
      //only set trans props color set in test
      shorthand: {
        background: 'default'
      }
    }
  }
});


ctr.create('.test', {
  background: '#00f',
  // multiple classes
  extend: {
    class: ['box', 'hover-red']
  }
});


const res = ctr.getRes();

module.exports = {
  res: res
};
