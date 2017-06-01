const CTR  = require('ctr').js;
const ctr  = new CTR();

const genBase = function (selector) {
  return {
    [selector]: {
      size: '200px',
      hover: {
        on: {
          width: '400px'
        }
      }
    }
  };
};


//have a 10s hover
ctr.create(genBase('.test-1'), {
  //sets options but its only local and will
  //only be used once
  hover: {
    duration: '10s'
  }
});

//should not inherit the 10s
ctr.create(genBase('.test-2'));


const res = ctr.getRes();


module.exports = {
  res: res
};
