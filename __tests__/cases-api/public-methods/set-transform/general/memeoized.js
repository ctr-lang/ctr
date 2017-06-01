const CTR  = require('ctr').js;


let tnCount = 0;
const ctr  = new CTR();

ctr.setOption({
  duplicateCSS: true
});

ctr.setTransform(function (res) {
  // should only run once
  ++tnCount;
  return res.toUpperCase();
});


ctr.create('.test', {
  size: '200px'
});


ctr.create('.test', {
  size: '200px'
});

module.exports = {
  exp: function (should) {
    tnCount.should.be.exactly(1);
  }
};
