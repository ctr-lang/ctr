const CTR  = require('ctr').js;
const ctr  = new CTR();

// add via object syntax
ctr.setClass({
  //class key
  box100: {
    $$: {
      background: 'red',
      'border-radius': '1px'
    },
    size: 100,
    background: '_$background$_',
    'border-radius': '_$border-radius$_'
  },
  box200: {
    $$: {
      background: 'red',
      'border-radius': '2px'
    },
    size: 200,
    background: '_$background$_',
    'border-radius': '_$border-radius$_'
  },
  box300: {
    $$: {
      background: 'red',
      'border-radius': '3px'
    },
    size: 300,
    background: '_$background$_',
    'border-radius': '_$border-radius$_'
  }
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
