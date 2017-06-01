const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create('.test-1', {
  width: '200px'
});

ctr.create('.test-2', {
  width: '400px'
});

//should only get last set -> .test-2
const res = ctr.getLastResult();

module.exports = {
  res: res
};
