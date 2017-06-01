const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.yaml('./shorthand.yml');

const res = ctr.getResult();

module.exports = {
  res: res
};
