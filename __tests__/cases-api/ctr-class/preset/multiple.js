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
      },
      red: {
        background: 'red'
      },
      blue: {
        background: 'blue'
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
    '.default-box': {
      extend: 'box'
    },

    '.large-box': {
      'extend-box': {
        preset: 'large'
      }
    },
    '.large-red-box': {
      'extend-box': {
        preset: ['large', 'red']
      }
    },
    '.small-box': {
      'extend-box': {
        preset: 'small'
      }
    },
    '.small-blue-box': {
      'extend-box': {
        preset: ['small', 'blue']
      }
    }
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
