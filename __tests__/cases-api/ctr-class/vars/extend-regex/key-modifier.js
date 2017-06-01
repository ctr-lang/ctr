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
ctr.create('.test-1', {
  width: '200px',
  'extend-hover-single:::color': {
    prop: 'color'
  },
  'extend-hover-single:::background': {
    prop: 'background',
    duration: '0.75s'
  },
  'extend-hover-single:::border-color': {
    prop: 'border-color',
    val: 'teal'
  }
});

//this is the reason you would use a key modifier
//it saves you some 63 chars, arthritis its real
ctr.create('.test-2', {
  width: '200px',
  'extend-hover-single-color': {
    class: 'hover-single',
    prop: 'color'
  },
  'extend-hover-single-background': {
    class: 'hover-single',
    prop: 'background',
    duration: '0.75s'
  },
  'extend-hover-single-border-color': {
    class: 'hover-single',
    prop: 'border-color',
    val: 'teal'
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
