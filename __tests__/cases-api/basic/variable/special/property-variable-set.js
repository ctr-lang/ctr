const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setOption({
  propertyVariable: true
});

ctr.create('.test', {
  $$: {
    prop1: 'height',
    prop2: 'width'
  },
  $prop1$: '200px',
  $prop2$: '400px'
});

const res = ctr.getRes();

module.exports = {
  res: res
};
