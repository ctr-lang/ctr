const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  //should be trumed by yaml set vars
  height: '400px',
  color: 'red'
});

const res = ctr.yaml('./local-vars-trump-global.yml').getRes();

module.exports = {
  res: res
};
