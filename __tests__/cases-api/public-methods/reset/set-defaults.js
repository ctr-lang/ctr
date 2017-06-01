const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create('.test-1', {
  width: '200px'
});

ctr.create('.test-2', {
  width: '400px'
});

//resets everything -> but sets new defualts
ctr.reset({
  variable: {
    size: '100px'
  },
  option: {
    classLock: true
  },
  callback: (str) => {return str;},
  transform: (str) => {return str;},
  yamlTransform: (str) => {return str;}
});

module.exports = {
  exp: function (should) {
    //everything should be reset
    should.notEqual(ctr.vars.size, 0);
    should.notEqual(ctr.globalOption.size, 0);
    should.notEqual(ctr.callback, false);
    should.notEqual(ctr.transform.length, 0);
    should.notEqual(ctr.yamlTransform.length, 0);
  }
};
