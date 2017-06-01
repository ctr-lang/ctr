const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  width: '99999px',
  height: '99999px',
  background: 'red'
});

ctr.create('.test', {
  $$: {
    //MUST specify
    privateVariable: true,
    width: '200px',
    height: '400px'
  },
  width: '_$width$_',
  height: '_$height$_',
  background: '$background$'
});


const res = ctr.getRes();

module.exports = {
  res: res
};
