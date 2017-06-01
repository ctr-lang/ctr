const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setClass('myCoolKolur', {
  color: 'red'
});

// add the class
ctr.setClass('box', {
  width: '250px',
  height: '250px',
  //extedn
  extend: 'myCoolKolur'
});

ctr.create('.test', {
  //extend extend
  extend: {
    class: 'box'
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
