const CTR  = require('ctr').js;
const ctr  = new CTR();

// add the class
ctr.setClass('box', {
  $$: {
    // default
    size: '200px',
    background: '#eee',

    //preset list
    preset: {
      large: {
        size: '500px'
      },
      small: {
        size: '100px'
      }
    }
  },

  //styles
  size: '_$size$_',
  background: '_$background$_'
});

ctr.create('.test', {
  width: '200px',
  //boxs
  components: {
    //default
    '.default-box': {
      extend: 'box'
    },
    //large
    '.large-box': {
      'extend-box': {
        preset: 'large',
        //change the background
        background: 'black'
      }
    },
    //should be able to overwrite prests
    '.large-box-overwrite': {
      'extend-box': {
        preset: 'large',
        size: '1000px'
      }
    }
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
