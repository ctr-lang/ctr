const CTR  = require('ctr').js;
const ctr  = new CTR();

//will overwrite class var
ctr.setVar({
  background: '#000',
  width: '400px'
});

// add the class
ctr.setClass('box', {
  $$: {
    width: '200px',
    height: '400px',
    background: '#00f'
  },
  width: '$width$',
  height: '$height$',
  background: '$background$'
});

ctr.create('.test', {
  'font-size': '1em',
  extend: {
    box: {
      width: '222px'
    }
  }
});


const res = ctr.getRes();

module.exports = {
  res: res
};