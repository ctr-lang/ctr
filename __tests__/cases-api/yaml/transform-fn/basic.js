const _    = require('lodash');
const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.yaml('/basic.yml', function (yamlObj) {
  return _.reduce(yamlObj, function (prv, val, key) {
    prv[key] = val;
    //creats a 'test-2'
    prv['.test-2'] = val;
    return prv;
  }, {});
});

const res = ctr.getRes();

module.exports = {
  res: res
};
