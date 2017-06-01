const CTR  = require('ctr').js;
const ctr  = new CTR();


const res = ctr.create('.test', {
  width: '200px'
}).res;

module.exports = {
  res: res
};
