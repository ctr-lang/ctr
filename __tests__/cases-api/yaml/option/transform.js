const fs   = require('fs');
const path = require('path');
const CTR  = require('ctr').js;
const exp  = fs.readFileSync(path.join(__dirname, 'test-data.css'), 'utf-8').replace(/test/g, 'TEST');
const ctr  = new CTR();

ctr.yaml('./test-data.yml', {
  transform: function (yamlObj) {
    //replace test object key with TEST
    yamlObj['.TEST'] = yamlObj['.test'];
    delete yamlObj['.test'];
    return yamlObj;
  }
});

const res = ctr.getRes();


module.exports = {
  res: res,
  exp: exp
};
