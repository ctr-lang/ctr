const CTR  = require('ctr').js;
const ctr  = new CTR();

const base = {
  width: '200px',
  height: '$height$',
  color: '$color$',
  top: '$top$'
};

//since there is no set vars yet
//ctr will not check the vars thus
//it will not throw a warning and the
//val will not be $var-not-found$
//it will just be the strings above
ctr.create('.test-1', base);

//set vars
ctr.setVariable({
  height: '200px',
  color: 'red',
  top: 50
});

//should have the above vars
ctr.create('.test-2', base);

//reset to base, and once
ctr.setVariable({
  height: '400px',
  top: 100
}, {
  reset: true,
  once: true
});

//new vars -> will throw warrning since color is not found
ctr.create('.test-3', base);

//should === .test-2
ctr.create('.test-4', base);

const res = ctr.getRes();


module.exports = {
  res: res
};
