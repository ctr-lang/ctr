const path = require('path');
const _h   = require(path.join(process.cwd(), '__tests__/cases-api/helpers.js'));
const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create('.test-dont-reset', {
  width: '100px'
});

const one = ctr.create('.test-1', {
  width: '200px'
}).getLastResult(true);

const two = ctr.create('.test-2', {
  width: '400px'
}).getLastResult({
  reset: true
});

module.exports = {
  exp: function() {
    //should equal css file
    const res = one + two;
    _h.cleanCSS(res).should.equal(_h.readFile(__filename));

    //should not be empty string since reset only resets the last set
    //as in it should have .test-dont-reset stlyes
    const exp = ctr.getRes();
    exp.length.should.be.exactly(37);
  }
};
