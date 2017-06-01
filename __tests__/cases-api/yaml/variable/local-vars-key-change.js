const CTR  = require('ctr').js;
const ctr  = new CTR();
//set new key
ctr.localVarKey = '$vars$';

ctr.yaml('./local-vars-key-change.yml');

const res = ctr.getResult();

module.exports = {
  res: res
};
