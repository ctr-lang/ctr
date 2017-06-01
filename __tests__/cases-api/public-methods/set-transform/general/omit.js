const CTR  = require('ctr').js;
const ctr  = new CTR();

const base = {
  width: '200px',
  height: '400px',
  background: 'red'
};

//init
ctr.create('.test-1', base);

//will not return anything
ctr.setTransform(function (res) {
  if (false) {
    return res;
  }
});

//both should not be processed
ctr.create('.test-2', base);
ctr.create('.test-3', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
