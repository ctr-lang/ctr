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
  extend: {
    $$: {
      delay: '0.25s',
      class: ['hover-single:::color', 'hover-single:::border-color']
    },
    'hover-single:::color': {
      prop: 'color'
    },
    'hover-single:::background': {
      prop: 'background',
      duration: '0.75s'
    },
    'hover-single:::border-color': {
      prop: 'border-color',
      val: 'teal'
    }
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
