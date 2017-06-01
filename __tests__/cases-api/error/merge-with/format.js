const CTR  = require('ctr').js;
const ctr  = new CTR();


ctr.create('.test', {
  width: '200px',
  //should throw error and replace with merge-var-wrong-format
  //but also still process height: 200px
  mergeWith: [['format error'], {
    height: '200px'
  }]
});

const res = ctr.getRes();

module.exports = {
  res: res
};
