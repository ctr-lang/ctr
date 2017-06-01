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
    const res1 = ctr.getResult({reset: false});
    _h.cleanCSS(res1).should.equal(_h.readFile(__filename));

    //since reset is false ctr should still have set stlyes
    const res2 = ctr.getResult(false);
    _h.cleanCSS(res2).should.equal(_h.readFile(__filename));

    //since reset is false ctr should still have set stlyes
    _h.cleanCSS(ctr.getResult()).should.equal(_h.readFile(__filename));
  }
};
