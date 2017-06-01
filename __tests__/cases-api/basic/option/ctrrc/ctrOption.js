const fs   = require('fs');
const path = require('path');
const del  = require('del');
const CTR  = require('ctr').js;
const ctr  = new CTR();
const ctrrcPath = path.join(process.cwd(), '.ctrrc.yml');

//write ctrrc for ctrOption
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
ctrOption:
  hover:
    duration: 10s`);

//dur of 10s
ctr.create('.test-10', {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
});

//del current ctrrc -> replace with $ctrOption
del.sync(path.join(ctrrcPath));
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
$ctr-option:
  hover:
    duration: 20s`);
//dur of 20s
ctr.create('.test-20', {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
});

//del current ctrrc -> replace with option
del.sync(path.join(ctrrcPath));
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
option:
  hover:
    duration: 30s`);
//dur of 30s
ctr.create('.test-30', {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
});

//get res
const res = ctr.getRes();

module.exports = {
  res: res
};
