const path = require('path');
const _h   = require(path.join(process.cwd(), '__tests__/cases-api/helpers.js'));
const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create('.test-1', {
  width: '200px'
});

ctr.create('.test-2', {
  width: '400px'
});


module.exports = {
  exp: function () {
    //should only get both test-1 & test-2 stlyes -> compiled together -> basic.css
    const res = ctr.getRes();
    _h.cleanCSS(res).should.equal(_h.readFile(__filename));

    //since the set is reset ctr should now be empty of results and return empty string
    ctr.getRes().length.should.equal(0);
  }
};
