const CTR  = require('ctr').js;
const ctr  = new CTR();

// add via object syntax
ctr.setClass({
  //global
  $$: {
    opacity: '1'
  },
  //class key
  box100: {
    $$: {
      background: 'red',
      'border-radius': '1px'
    },
    size: 100,
    background: '_$background$_',
    'border-radius': '_$border-radius$_',
    opacity: '_$opacity$_'
  },
  box200: {
    size: 200,
    background: 'red',
    'border-radius': '2px',
    opacity: '_$opacity$_'
  },
  box300: {
    $$: {
      background: 'red',
      'border-radius': '3px'
    },
    size: 300,
    background: '_$background$_',
    'border-radius': '_$border-radius$_',
    opacity: '_$opacity$_'
  }
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
