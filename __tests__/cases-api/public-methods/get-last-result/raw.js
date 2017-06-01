const CTR  = require('ctr').js;
const ctr  = new CTR();

const one = ctr.create('.test-1', {
  width: '200px'
}).getLastResult(false, true);

const two = ctr.create('.test-2', {
  width: '400px'
}).getLastResult({
  raw: true
});


module.exports = {
  exp: function() {
    //since its returns a raw set both should have a size of 1
    one.size.should.be.exactly(1);
    two.size.should.be.exactly(1);
  }
};
