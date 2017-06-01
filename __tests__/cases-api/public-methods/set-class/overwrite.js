const CTR  = require('ctr').js;
const ctr  = new CTR();

//set the classLock so we can't overwrite
ctr.setOption({
  classLock: true
});

//set class
ctr.setClass('Test', {
  width: '200px'
});

//create base test
ctr.create('.test-1', {
  extend: 'Test'
});

//lets try to overwrite -> it should not let us
ctr.setClass('Test', {
  width: '400px'
});

//.test-2 should equal .test-1
ctr.create('.test-2', {
  extend: 'Test'
});

//pass the overwrite override to modify class
ctr.setClass('Test', {
  width: '400px'
}, {
  overwrite: true
});

//.test-3 should equal 400px
ctr.create('.test-3', {
  extend: 'Test'
});


const res = ctr.getRes();


module.exports = {
  res: res
};
