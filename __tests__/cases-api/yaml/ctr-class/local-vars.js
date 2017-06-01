const CTR  = require('ctr').js;
const ctr  = new CTR();

//add yaml classses
ctr.yaml('./local-vars.yml', {
  setClass: true
});

ctr.create('.test', {
  width: '200px',
  'comp-.box1': {
    extend: 'box100'
  },
  'comp-.box2': {
    'extend-box200': {
      background: 'blue'
    }
  },
  'comp-.box3': {
    'extend-box300': {
      background: 'teal',
      'border-radius': '10px'
    }
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
