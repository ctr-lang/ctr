const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  color: 'red'
});

const res = ctr.yaml('./var-not-found.yml').getRes();

module.exports = {
  res: res
};
