const CTR  = require('ctr').js;
const ctr  = new CTR();

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

//add classes
ctr.setClass('hover-color-blue', {
  $$: {
    duration: '1s'
  },
  hover: {
    option: {
      duration: '_$duration$_'
    },
    color: 'blue'
  }
});
ctr.setClass('hover-bg-red', {
  $$: {
    duration: '1s'
  },
  hover: {
    option: {
      duration: '_$duration$_'
    },
    background: 'red'
  }
});

//create
ctr.create('.test', {
  'font-size': '1em',
  color: 'black',
  extend: {
    $$: {
      duration: '10s'
    },
    //can use with class key
    class: ['hover-color-blue', 'hover-bg-red'],
    //key based
    box: {
      //overwrite vars
      width: '500px',
      height: '500px'
    }
  }
});


const res = ctr.getRes();

module.exports = {
  res: res
};
