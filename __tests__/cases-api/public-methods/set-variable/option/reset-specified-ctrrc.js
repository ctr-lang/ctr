const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;


//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
# I'm a comment!
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
  height: '50px',
  top: 100
}, {
  overwrite: true
});

//should pick up above vars
ctr.create('.test-2', base);


//reset vars, although since its a object it disregards the base
//rc vars so .test-3 will have var-not-found
ctr.setVariable({
  reset: {
    height: '420px'
  }
});

//will have two $var-not-found$
ctr.create('.test-3', base);

//going to reset again, and now it should reset back to rc
ctr.setVariable({reset: true});

//since no override should === .test-1
ctr.create('.test-4', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
