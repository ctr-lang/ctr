const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.yaml('/test-data.yml', {
  hover: {
    duration: '10s'
  }
});

const res = ctr.getResult();


module.exports = {
  res: res
};
