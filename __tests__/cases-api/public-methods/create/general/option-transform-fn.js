const CTR  = require('ctr').js;
const ctr  = new CTR();

const base = {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
};

//have a 10s hover
ctr.create('.test-1', base, {
  //sets options but its only local and will
  //only be used once
  hover: {
    duration: '10s'
  }
}, function (str) {
  return str.toUpperCase();
});

//should not inherit the 10s or transform fn
ctr.create('.test-2', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
