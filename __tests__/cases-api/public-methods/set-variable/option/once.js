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

//set vars
ctr.setVariable({
  height: '200px',
  color: 'red',
  top: 50
});

//should have the above vars
ctr.create('.test-2', base);

//set new vars but only once
ctr.setVariable({
  height: '420px',
  top: 100
}, {once: true});


//color will still be inherited -> height and top new
ctr.create('.test-3', base);


//since we only apply once should === .test-2
ctr.create('.test-4', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
