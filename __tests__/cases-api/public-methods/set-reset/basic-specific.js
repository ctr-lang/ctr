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
ctr.setCallback(function (str) {
  return str;
});


module.exports = {
  exp: function (should) {
    should.notEqual(ctr.vars.size, 0);
    should.notEqual(ctr.globalOption.size, 0);
    should.notEqual(ctr.ctrClass.size, 0);
    should.notEqual(ctr.transform.length, 0);
    should.notEqual(ctr.yamlTransform.length, 0);
    should.notEqual(ctr.callback, false);

    //should only reset 'true' resets all set values
    ctr.setReset({
      transform: true,
      yamlTransform: true,
      callback: true
    });

    //should still be preset, not reset
    should.notEqual(ctr.vars.size, 0);
    should.notEqual(ctr.globalOption.size, 0);

    ctr.transform.length.should.equal(0);
    ctr.yamlTransform.length.should.equal(0);
    ctr.callback.should.equal(false);
    //classes are not reset, becuase well it just wounld make sense
    ctr.ctrClass.size.should.equal(1);
  }
};
