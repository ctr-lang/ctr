const CTR  = require('ctr').js;
const ctr  = new CTR();

//set vars to be picked up
ctr.setVar({
  extend: {
    'hover-color-blue': {
      duration: '99s',
      delay: '99s'
    },
    'hover-bg-red': {
      duration: '22s',
      delay: '22s'
    }
  }
});


//base, no changes
ctr.setClass('hover-border-color-teal', {
  $$: {
    duration: '1s',
    delay: '0s',
    ease: 'ease-in'
  },
  hover: {
    shorthand: {
      'border-color': ['_$duration$_', '_$delay$_']
    },
    'border-color': 'teal'
  }
});
ctr.setClass('hover-color-blue', {
  $$: {
    duration: '1s',
    delay: '0s',
    ease: 'ease-in'
  },
  hover: {
    shorthand: {
      color: ['_$duration$_', '_$delay$_', '_$ease$_']
    },
    color: 'blue'
  }
});
ctr.setClass('hover-bg-red', {
  $$: {
    duration: '1s',
    delay: '0s',
    ease: 'ease-in'
  },
  hover: {
    shorthand: {
      background: ['_$duration$_', '_$delay$_', '_$ease$_']
    },
    background: 'red'
  }
});

//create
ctr.create('.test', {
  'font-size': '1em',
  color: 'black',
  extend: {
    //can use with class key
    class: ['hover-border-color-teal', 'hover-color-blue', 'hover-bg-red'],
    'hover-bg-red': {
      ease: 'ease-out',
      //will not overwrite setVar, yeah I know, but you
      //should pick one method and not use both, although
      //if you have a good reason for me to duplicate this
      //logic it is possible to make this overwrite global
      delay: '999s'
    }
  }
});


const res = ctr.getRes();

module.exports = {
  res: res
};
