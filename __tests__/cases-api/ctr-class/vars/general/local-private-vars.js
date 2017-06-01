const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  width: '999px',
  height: '999px',
  background: '#000',
  'main-color': '#f00'
});

// add the class
// _$<var>$_ will not be overwriten
ctr.setClass('box', {
  $$: {
    width: '200px',
    height: '400px',
    background: '#00f'
  },
  width: '_$width$_',
  height: '_$height$_',
  background: '_$background$_',
  color: '$main-color$'
});

ctr.create('.test', {
  'font-size': '1em',
  extend: 'box'
});


const res = ctr.getRes();

module.exports = {
  res: res
};
