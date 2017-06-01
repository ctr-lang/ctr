const CTR  = require('ctr').js;
const ctr  = new CTR();

// add the class
ctr.setClass('box', {
  //default vars
  $$: {
    width: '200px',
    height: '400px',
    background: '#00f'
  },
  width: '$width$',
  height: '$height$',
  background: '$background$'
});
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


ctr.create('.test', {
  'font-size': '1em',
  extend: {
    //common object applied to all, classes
    $$: {
      duration: '10s',
      delay: '1s'
    },
    //key based
    box: {
      //overwrite vars
      width: '500px',
      height: '500px'
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
