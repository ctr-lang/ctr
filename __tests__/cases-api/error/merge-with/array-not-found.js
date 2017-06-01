const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  height: '200px'
});

ctr.create('.test', {
  width: '200px',
  //should still pick up and merge height
  mergeWith: ['$error-msg.should.format.key.too$', '$height$']
});

const res = ctr.getRes();

module.exports = {
  res: res
};
