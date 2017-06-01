const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;
const exp  = fs.readFileSync(path.join(__dirname, 'test-data.css'), 'utf-8');
const ctr  = new CTR();

const res = ctr.yaml().getResult();


module.exports = {
  res: res,
  exp: exp
};
