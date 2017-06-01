const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  data: {
    height: '200px'
  }
});

ctr.create('.test', {
  width: '200px',
  //should still pick up and merge height
  merge: ['$error-msg.should.format.key.too$', '$data$']
});

const res = ctr.getRes();

module.exports = {
  res: res
};
