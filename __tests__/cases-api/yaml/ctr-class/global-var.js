const CTR  = require('ctr').js;
const ctr  = new CTR();

//import yml classes
ctr.yaml('./global-var.yml', {
  setClass: true
});

ctr.create('.test', {
  width: '200px',
  'comp-.box1': {
    extend: 'box100'
  },
  'comp-.box2': {
    'extend-box200': {
      opacity: '0.5'
    }
  },
  'comp-.box3': {
    'extend-box300': {
      background: 'teal',
      'border-radius': '10px',
      opacity: '0.75'
    }
  }
});


const res = ctr.getRes();

module.exports = {
  res: res
};
