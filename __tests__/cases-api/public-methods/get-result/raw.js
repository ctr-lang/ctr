const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create('.test-1', {
  width: '200px'
});
ctr.create('.test-2', {
  width: '400px'
});

//should only get both test-1 & test-2 stlyes raw as a Set
const res1 = ctr.getResult({raw: true});

// need to repet styles since getResult reset set
ctr.create('.test-3', {
  width: '200px'
});
ctr.create('.test-4', {
  width: '400px'
});

//should only get both test-3 & test-4 stlyes raw as a Set
const res2 = ctr.getResult(false, true);

module.exports = {
  exp: function () {
    res1.size.should.be.exactly(2);
    res2.size.should.be.exactly(2);
  }
};
