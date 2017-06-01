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
    let res1 = ctr.getResult({reset: false, raw: true});
    //since we gots us a Set lets build it
    res1 = [...res1.values()].join('');
    _h.cleanCSS(res1).should.equal(_h.readFile(__filename));

    //since reset is false ctr should still have set stlyes
    let res2 = ctr.getResult(false, true);
    res2 = [...res2.values()].join('');
    _h.cleanCSS(res2).should.equal(_h.readFile(__filename));

    //since reset is false ctr should still have set stlyes
    _h.cleanCSS(ctr.getResult()).should.equal(_h.readFile(__filename));
  }
};
