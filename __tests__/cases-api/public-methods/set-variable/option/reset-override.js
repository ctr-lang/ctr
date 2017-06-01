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

//overwrite and add a new
ctr.setVariable({
  top: 100,
  'font-size': '10px'
}, {
  overwrite: true
});

//top should be 100, plus a font-size!
ctr.create('.test-2', Object.assign({
  'font-size': '$font-size$'
}, base));

//reset vars, will revert back to rc
ctr.setVariable({
  //override rc height
  height: '420px'
}, {
  overwrite: true
});

//should have new height
ctr.create('.test-3', base);

//reset back, reverts back to base and does not
//keep the above setVars
ctr.setVariable({reset: true});

///should === .test-1
ctr.create('.test-4', base);


const res = ctr.getRes();


module.exports = {
  res: res
};
