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


ctr.setVariable({
  height: '200px'
});

//height -> vars not found
ctr.create('.test-2', base);

ctr.setVariable({
  color: 'red'
});

//color -> vars not found
ctr.create('.test-3', base);

ctr.setVariable({
  top: 50
});

//alll
ctr.create('.test-3', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
