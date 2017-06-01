const fs   = require('fs');
const path = require('path');
const CTR  = require('ctr').js;
const exp  = fs.readFileSync(path.join(__dirname, 'test-data.css'), 'utf-8');
const ctr  = new CTR();

ctr.yaml('/__tests__/cases-api/yaml/file-path/test-data.yml');

const res = ctr.getResult();

module.exports = {
  res: res,
  exp: exp
};
