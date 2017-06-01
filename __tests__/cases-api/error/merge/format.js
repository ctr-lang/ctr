const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  //wrong only works with mergeWith
  height: '999px',
  //correct way
  data: {
    height: '200px'
  }
});

ctr.create('.test', {
  width: '200px',
  //should throw error and replace with merge-var-wrong-format
  //but also still process height: 200px
  merge: [['format error'], '$height$', '$data$']
});

const res = ctr.getRes();

module.exports = {
  res: res
};
