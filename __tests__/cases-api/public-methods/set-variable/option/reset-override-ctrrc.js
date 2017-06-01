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
  height: '50px',
  top: 100
}, {
  overwrite: true
});

//should pick up above vars
ctr.create('.test-2', base);


//reset vars, back to rc, although height is now going to be 222px
ctr.setVariable({
  height: '222px'
}, {reset: true});

ctr.create('.test-3', base);

//going to reset again and not override
ctr.setVariable({reset: true});

//since no override should === .test-1
ctr.create('.test-4', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
