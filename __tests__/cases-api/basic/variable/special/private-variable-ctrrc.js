const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;
const ctr  = new CTR();

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
privateVariable: true`);

ctr.setVar({
  width: '99999px',
  height: '99999px',
  background: 'red'
});

ctr.create('.test', {
  $$: {
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
