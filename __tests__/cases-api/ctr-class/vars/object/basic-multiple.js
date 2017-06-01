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
ctr.setClass('hover-bg-red', {
  $$: {
    duration: '0.5s',
    ease: 'ease-in',
    delay: '0s'
  },
  hover: {
    background: 'red',
    shorthand: {
      background: ['_$duration$_', '_$delay$_', '_$ease$_']
    }
  }
});


ctr.create('.test', {
  'font-size': '1em',
  extend: {
    //key based
    box: {
      //overwrite vars
      width: '500px',
      height: '500px'
    },
    'hover-bg-red': {
      delay: '1s',
      duration: '10s'
    }
  }
});


const res = ctr.getRes();

module.exports = {
  res: res
};
