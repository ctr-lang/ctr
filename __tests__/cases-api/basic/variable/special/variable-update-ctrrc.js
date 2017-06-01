const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;
const ctr  = new CTR();

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
variableUpdate: true`);


ctr.create('.test', {
  $$: {
    size: '200px',
    //ref above var
    height: '$size$',
    //ref above var
    width: '$height$'
  },
  height: '$height$',
  width: '$width$'
});

const res = ctr.getRes();

module.exports = {
  res: res
};
