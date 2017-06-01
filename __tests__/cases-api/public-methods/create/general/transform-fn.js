const CTR  = require('ctr').js;
const ctr  = new CTR();

const base = {
  size: '200px'
};

//shoulbd be upper case
ctr.create('.test-1', base, function (str) {
  return str.toUpperCase();
});


const res = ctr.getRes();


module.exports = {
  res: res
};
