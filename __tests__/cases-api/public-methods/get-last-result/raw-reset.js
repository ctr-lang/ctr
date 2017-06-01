const path = require('path');
const _h   = require(path.join(process.cwd(), '__tests__/cases-api/helpers.js'));
const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create('.test-dont-reset', {
  width: '100px'
});

const one = ctr.create('.test-1', {
  width: '200px'
}).getLastResult(true, true);

const two = ctr.create('.test-2', {
  width: '400px'
}).getLastResult({
  raw: true,
  reset: true
});

module.exports = {
  exp: function() {
    //should not be empty string since reset only resets the last set
    //as in it should have .test-dont-reset stlyes
    const exp = ctr.getRes();
    _h.cleanCSS(exp).should.equal(_h.readFile(__filename));

    //since its returns a raw set both should have a size of 1
    one.size.should.be.exactly(1);
    two.size.should.be.exactly(1);
  }
};
