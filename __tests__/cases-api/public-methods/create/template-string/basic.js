const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create('.test', `
  width: 200px
  height: 200px
`);

const res = ctr.getRes();

module.exports = {
  res: res
};
