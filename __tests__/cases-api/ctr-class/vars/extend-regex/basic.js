const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setClass('hover-single', {
  $$: {
    propVariable: true,
    prop: 'background',
    val: 'blue',
    duration: '0.5s',
    ease: 'ease-in',
    delay: '0s'
  },
  hover: {
    _$prop$_: '$val$',
    shorthand: {
      _$prop$_: ['_$duration$_', '_$delay$_', '_$ease$_']
    }
  }
});

//create
ctr.create('.test', {
  width: '200px',
  'extend-hover-single': {
    prop: 'color'
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
