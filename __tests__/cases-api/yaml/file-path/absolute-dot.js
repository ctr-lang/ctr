const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;
const exp  = fs.readFileSync(path.join(__dirname, 'test-data.css'), 'utf-8');
const ctr  = new CTR();

const style = ctr
              .yaml('./__tests__/cases-api/yaml/file-path/test-data.yml')
              .getResult();

module.exports = {
  res: style,
  exp: exp
};
