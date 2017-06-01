const CTR  = require('ctr').js;
const ctr  = new CTR();

//shoulbd be upper case
ctr.create({'.test-1': {size: '200px'}}, function (str) {
  return str.toUpperCase();
});


const res = ctr.getRes();


module.exports = {
  res: res
};
