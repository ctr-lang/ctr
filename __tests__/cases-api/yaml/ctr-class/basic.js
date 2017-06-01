const CTR  = require('ctr').js;
const ctr  = new CTR();

//add yaml class data
ctr.yaml('./basic.yml', {
  setClass: true
});

ctr.create('.test', {
  width: '200px',
  'comp-.box1': {
    extend: 'box100'
  },
  'comp-.box2': {
    extend: 'box300'
  },
  'comp-.box3': {
    extend: 'box500'
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
