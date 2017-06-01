const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  width: '200px',
  height: '400px',
  background: '#00f'
});

// add the class
ctr.setClass('box', {
  width: '$width$',
  height: '$height$',
  background: '$background$'
});

ctr.create('.test', {
  'font-size': '1em',
  extend: 'box'
});


const res = ctr.getRes();

module.exports = {
  res: res
};
