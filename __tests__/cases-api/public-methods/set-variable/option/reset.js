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

//set init
ctr.setVariable({
  height: '50px',
  top: 100,
  color: 'red'
});

//should pick up above vars
ctr.create('.test-2', base);

ctr.setVariable({reset: true});

//should === .test-1
ctr.create('.test-3', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
