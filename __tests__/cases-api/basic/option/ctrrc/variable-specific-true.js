const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
option:
  hover:
    duration: 20s
  global:
    sort: -len

# specifies local vars are at the root, aka. global
$$: true
size: 200px
hover:
  on:
    width: 400px
`);
const ctr  = new CTR();

const res = ctr.create('.test', {
  size: '$size$',
  hover: {
    on: {
      width: '$hover.on.width$'
    }
  }
}).getResult();


module.exports = {
  res: res
};
