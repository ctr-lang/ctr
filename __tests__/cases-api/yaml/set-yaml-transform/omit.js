const path = require('path'),
      _    = require('lodash'),
      CTR  = require('ctr').js;
const ctr  = new CTR();

//allows for duplication of CSS styles
ctr.setOption({
  duplicateCSS: true
});

//base style nothing altered
ctr.yaml('./test-data.yml');

//set transform
ctr.setYamlTransform(function (yamlObj) {
  //omit everything exept '.test-1'
  return _.reduce(yamlObj, function (obj, val, key) {
    if (key === '.test-1') {
      obj[key] = val;
    }
    return obj;
  }, {});
});

//both should have uppercase key
ctr.yaml('./test-data.yml');
ctr.yaml('./test-data.yml');

const res = ctr.getRes();

module.exports = {
  res: res
};
