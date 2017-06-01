const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVariable({
  size: '10px'
});
ctr.setOption({
  hover: {
    duration: '10s'
  }
});
ctr.setClass('Test', {
  width: '220px'
});
ctr.setTransform(function (str) {
  return str;
});
ctr.setYamlTransform(function (str) {
  return str;
});
ctr.setCallback(function (err, res) {
  this.res = res;
  this._resSetAdd(res, this.resultKey, !global._ctrNodeError_);
});
ctr.localVarKey = 'asdasd';

ctr.create('.test-1', {
  width: '200px'
});

ctr.create('.test-2', {
  width: '400px'
});


module.exports = {
  exp: function (should) {
    //should all have values
    should.notEqual(ctr.vars.size, 0);
    should.notEqual(ctr.globalOption.size, 0);
    should.notEqual(ctr.resultSet.size, 0);
    should.notEqual(ctr.resultDbMap.size, 0);
    should.notEqual(ctr.ctrClass.size, 0);
    should.notEqual(ctr._ctrClassRaw.size, 0);
    should.notEqual(ctr.resultKeySet.length, 0);
    should.notEqual(ctr.transform.length, 0);
    should.notEqual(ctr.yamlTransform.length, 0);
    should.notEqual(ctr.resultKeySet.length, 0);
    should.notEqual(ctr._selector.length, 0);
    should.notEqual(ctr.callback, false);
    should.notEqual(ctr.localVarKey, '$$');
    should.notEqual(ctr.rendered, false);
    should.notEqual(ctr._rcConfigRan, false);
    should.notEqual(ctr.resultKey, null);
    //mock errors
    ctr.error = true;
    ctr.stylusError = true;
    should.notEqual(ctr.error, false);
    should.notEqual(ctr.stylusError, false);


    // resets everything!!!!!
    ctr.reset();

    ctr.vars.size.should.equal(0);
    ctr.globalOption.size.should.equal(0);
    ctr.resultSet.size.should.equal(0);
    ctr.resultDbMap.size.should.equal(0);
    ctr.ctrClass.size.should.equal(0);
    ctr._ctrClassRaw.size.should.equal(0);
    ctr.resultKeySet.length.should.equal(0);
    ctr.transform.length.should.equal(0);
    ctr.yamlTransform.length.should.equal(0);
    ctr.resultKeySet.length.should.equal(0);
    ctr._selector.length.should.equal(0);
    ctr.callback.should.equal(false);
    ctr.localVarKey.should.equal('$$');
    ctr.error.should.equal(false);
    ctr.stylusError.should.equal(false);
    ctr.rendered.should.equal(false);
    should(ctr.resultKey).be.exactly(null);
  }
};
