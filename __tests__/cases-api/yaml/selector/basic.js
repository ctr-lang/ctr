const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.yaml('/basic.yml', '.test');

const res = ctr.getRes();

module.exports = {
  res: res
};
