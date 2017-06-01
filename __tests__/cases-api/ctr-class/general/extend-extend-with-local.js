const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setClass('myCoolKolur', {
  $$: {
    color: 'red'
  },
  color: '$color$'
});

// add the class
ctr.setClass('box', {
  $$: {
    color: 'red'
  },
  width: '250px',
  height: '250px',
  //extedn
  extend: {
    myCoolKolur: {
      //change color
      color: '$color$'
    }
  }
});

ctr.create('.test', {
  //extend extend
  extend: {
    box: {
      color: 'blue'
    }
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
