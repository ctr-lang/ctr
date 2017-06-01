const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  notFoundTest: {
    height: '200px'
  }
});

ctr.create('.test', {
  width: '200px',
  merge: '$error-msg$'
});

const res = ctr.getRes();

module.exports = {
  res: res
};
