const CTR  = require('ctr').js;

const ctr  = new CTR();

ctr.yaml('./basic.yml');

const res = ctr.getResult();

module.exports = {
  res: res
};
