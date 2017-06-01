const CTR  = require('ctr').js;
const ctr  = new CTR();

// add via object syntax
ctr.setClass({
  //class key
  box100: {
    //class val
    size: 100
  },
  box200: {
    size: 200
  },
  box300: {
    size: 300
  },
  box400: {
    size: 400
  },
  box500: {
    size: 500
  }
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
