const CTR  = require('ctr').js;
const ctr  = new CTR();

//to be reset
ctr.setOption({
  hover: {
    duration: '10s'
  }
});
ctr.setVariable({
  color: '#f00'
});

ctr.yaml('./basic.yml');

const res = ctr.getResult();

module.exports = {
  res: res
};
