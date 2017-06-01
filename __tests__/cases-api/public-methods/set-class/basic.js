const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setClass('Test-1', {
  width: '200px'
});

//object syntax
ctr.setClass({
  'Test-2': {
    width: '400px'
  }
});

ctr.create('.test-1', {
  extend: 'Test-1'
});

//object syntax
ctr.create({
  '.test-2': {
    extend: 'Test-2'
  }
});


const res = ctr.getRes();


module.exports = {
  res: res
};
