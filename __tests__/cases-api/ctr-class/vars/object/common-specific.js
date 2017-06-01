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

//single
ctr.create('.test-1', {
  'font-size': '1em',
  extend: {
    $$: {
      //only applied to select keys
      class: 'hover-color',
      duration: '999s',
      delay: '222s'
    },
    'hover-border-color': {
      class: 'hover-single',
      prop: 'border-color',
      //override
      ease: 'ease-out'
    },
    'hover-color': {
      class: 'hover-single',
      prop: 'color',
      //override
      ease: 'ease-out'
    },
    'hover-bg': {
      class: 'hover-single',
      prop: 'background',
      val: 'red',
      //override common
      duration: '1s'
    }
  }
});

// array
ctr.create('.test-2', {
  'font-size': '1em',
  extend: {
    $$: {
      //only applied to select keys
      class: ['hover-color', 'hover-bg'],
      duration: '999s',
      delay: '222s'
    },
    'hover-border-color': {
      class: 'hover-single',
      prop: 'border-color',
      //override
      ease: 'ease-out'
    },
    'hover-color': {
      class: 'hover-single',
      prop: 'color',
      //override
      ease: 'ease-out'
    },
    'hover-bg': {
      class: 'hover-single',
      prop: 'background',
      val: 'red',
      //override common
      duration: '1s'
    }
  }
});


const res = ctr.getRes();

module.exports = {
  res: res
};
