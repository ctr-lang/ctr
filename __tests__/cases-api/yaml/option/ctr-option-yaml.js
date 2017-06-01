const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.yaml('./ctr-option-yaml.yml');

const res = ctr.getResult();

module.exports = {
  res: res
};
