const fs   = require('fs');
const path = require('path');
const CTR  = require('ctr').js;
const exp  = fs.readFileSync(path.join(__dirname, 'basic.css'), 'utf-8');
const ctr  = new CTR();

ctr.yaml(fs.readFileSync(path.join(__dirname, 'basic.yml')));

const res = ctr.getResult();


module.exports = {
  res: res,
  exp: exp
};
