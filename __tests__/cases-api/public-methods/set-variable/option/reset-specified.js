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


//reset vars specified, but since the other two vars are not
//specifed they will be left out so .test-3 will have var-not-found
ctr.setVariable({
  reset: {
    height: '420px'
  }
});

//will have two $var-not-found$
ctr.create('.test-3', base);

//reset back to init
ctr.setVariable({
  reset: {
    height: '50px',
    top: 100,
    color: 'red'
  }
});

//should not === .test-3
ctr.create('.test-4', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
