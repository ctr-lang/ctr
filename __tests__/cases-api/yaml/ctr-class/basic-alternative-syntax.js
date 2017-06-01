const CTR  = require('ctr').js;
const ctr  = new CTR();

//add yaml class data
ctr.yaml('./basic-alternative-syntax.yml');

const res = ctr.getRes();

module.exports = {
  res: res
};
