const _    = require('lodash');
const CTR  = require('ctr').js;
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
ctr.setYamlTransform(uppercaseKey, {once: true});


//should have uppercase
ctr.yaml('./test-data.yml');
//should === the first yaml -> no uppercase
ctr.yaml('./test-data.yml');

const res = ctr.getRes();

module.exports = {
  res: res
};
