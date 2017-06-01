const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;


//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
variable:
  height: 200px
  color: red
  top: 50`);

const ctr  = new CTR();

const base = {
  width: '200px',
  height: '$height$',
  color: '$color$',
  top: '$top$'
};

//picked up through rc
ctr.create('.test-1', base);

//overwrite
ctr.setVariable({
  top: 100
}, {
  overwrite: true
});

//top should be 100
ctr.create('.test-2', base);

//reset vars, completely, disregard rc base
ctr.setVariable({
  reset: true,
  ctrrc: false
});

//no vars, not valid
//since there now is no set vars yet
//ctr will not check the vars thus
//it will not throw a warning and the
//val will not be $var-not-found$
//it will just be the strings above
ctr.create('.test-3', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
