const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setClass('box', {
  //default vars
  $$: {
    width: '200px',
    height: '400px',
    background: '#00f'
  },
  width: '$width$',
  height: '$height$',
  background: '$background$'
});
//add classes
ctr.setClass('hover-red', {
  hover: {
    background: 'red'
  }
});


ctr.create('.test', {
  'font-size': '1em',
  extend: {
    //can use with class key
    class: 'hover-red',
    //key based
    box: {
      //overwrite vars
      width: '500px',
      height: '500px'
    }
  }
});


const res = ctr.getRes();

module.exports = {
  res: res
};
