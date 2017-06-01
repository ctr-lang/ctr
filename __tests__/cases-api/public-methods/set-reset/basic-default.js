const CTR  = require('ctr').js;
const ctr  = new CTR();

//set vars
ctr.setVariable({
  size: '400px',
  color: 'red'
});

ctr.setOption({
  hover: {
    duration: '10s'
  }
});

//should have above vars and options
ctr.create('.test-1', {
  size: '$size$',
  color: '$color$',
  hover: {
    background: 'green'
  }
});

//reset
ctr.setReset({
  //resets, but then sets vars/options to new vals
  variable: {
    size: '200px',
    color: 'blue'
  },
  option: {
    hover: {
      duration: '20s'
    }
  },
  transform: function (str) {
    return str.toUpperCase();
  }
});


ctr.create('.test-2', {
  size: '$size$',
  color: '$color$',
  hover: {
    background: 'green'
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
