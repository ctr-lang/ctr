const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;
const exp  = fs.readFileSync(path.join(__dirname, 'test-data.css'), 'utf-8');
const ctr  = new CTR();

//allows duplicate style in the res
ctr.setOption({
  duplicateCSS: true
});

ctr.yaml(['./test-data.yml', './array.yml']);

const res = ctr.getResult();

module.exports = {
  res: res,
  exp: exp + '\n' + exp
};
