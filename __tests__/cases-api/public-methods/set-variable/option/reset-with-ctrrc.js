const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;


//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
$$:
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


//reset vars, will revert back to rc but have height of 300px
ctr.setVariable({
  height: '300px'
}, {
  reset: true
});

///should !== .test-1 should have 300px height
ctr.create('.test-2', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
