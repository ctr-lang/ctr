const CTR  = require('ctr').js;
const ctr  = new CTR();


const res = ctr.create('.test', 'width: 200px').getRes();

module.exports = {
  res: res
};
