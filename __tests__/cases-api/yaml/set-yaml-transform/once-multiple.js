const _    = require('lodash');
const CTR  = require('ctr').js;
const ctr  = new CTR();

//allows for duplication of CSS styles
ctr.setOption({
  duplicateCSS: true
});

//base style nothing altered
ctr.yaml('./test-data.yml');


//adds font-size
const addFontSize = function (yamlObj) {
  return _.reduce(yamlObj, function (obj, val, key) {
    val['font-size'] = '12px';
    obj[key] = val;
    return obj;
  }, {});
};
ctr.setYamlTransform(addFontSize);

//uppercase key
const uppercaseKey = function (yamlObj) {
  return _.reduce(yamlObj, function (obj, val, key) {
    key = key.toUpperCase();
    obj[key] = val;
    return obj;
  }, {});
};
ctr.setYamlTransform(uppercaseKey, {once: true});


//should have font-size and uppercase
ctr.yaml('./test-data.yml');
//should only have font-size
ctr.yaml('./test-data.yml');

const res = ctr.getRes();

module.exports = {
  res: res
};
