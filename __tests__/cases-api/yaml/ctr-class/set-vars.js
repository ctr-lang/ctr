const CTR  = require('ctr').js;
const ctr  = new CTR();

//set options, vars, and class, then get res
ctr.yaml('./set-vars.yml');

const res = ctr.getRes();

module.exports = {
  res: res
};
