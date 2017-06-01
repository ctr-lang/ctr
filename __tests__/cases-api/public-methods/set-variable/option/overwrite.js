const CTR  = require('ctr').js;
const ctr  = new CTR();

const base = {
  width: '200px',
  height: '$height$',
  color: '$color$',
  top: '$top$'
};

//invalid no set vars
//since there is no set vars yet
//ctr will not check the vars thus
//it will not throw a warning and the
//val will not be $var-not-found$
//it will just be the strings above
ctr.create('.test-1', base);

//set init vars
ctr.setVariable({
  height: '200px',
  color: 'red',
  top: 50
});

//should have the above vars
ctr.create('.test-2', base);

//should fail at setting new var since
//since its already defined
ctr.setVariable({
  top: 500000
});

//should equal .test-2
ctr.create('.test-3', base);

//let's try again this time using overwrite option
ctr.setVariable({
  height: '100px',
  top: 10
}, {
  overwrite: true
});

//options should be merges/overwrite
ctr.create('.test-4', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
