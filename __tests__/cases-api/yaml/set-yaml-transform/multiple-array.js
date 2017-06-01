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

//uppercase key
const uppercaseKey = function (yamlObj) {
  return _.reduce(yamlObj, function (obj, val, key) {
    key = key.toUpperCase();
    obj[key] = val;
    return obj;
  }, {});
};

//adds font-size
const addFontSize = function (yamlObj) {
  return _.reduce(yamlObj, function (obj, val, key) {
    val['font-size'] = '12px';
    obj[key] = val;
    return obj;
  }, {});
};


//set transform
ctr.setYamlTransform([uppercaseKey, addFontSize]);

//both should have uppercase key
ctr.yaml('./test-data.yml');
ctr.yaml('./test-data.yml');

const res = ctr.getRes();

module.exports = {
  res: res
};
