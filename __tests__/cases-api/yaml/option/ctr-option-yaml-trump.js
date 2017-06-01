const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setOption({
  hover: {
    delay: '0s'
  }
});

ctr.yaml('./ctr-option-yaml.yml');

const res = ctr.getResult();

module.exports = {
  res: res
};
