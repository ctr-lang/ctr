const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;
const ctr  = new CTR();

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
propertyVariable: true`);


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
