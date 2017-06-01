const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), `
ctrOption:
  hover:
    duration: 420s`);

const ctr  = new CTR();

const base = {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
};

//should have dur: 420s
ctr.create('.test-1', base);

//reset options, and replace with new
ctr.setOption({
  reset: {
    hover: {
      delay: '10s'
    }
  }
});

//only should have delay 10s
ctr.create('.test-2', base);


//reset options, and replace with new
ctr.setOption({
  reset: {
    hover: {
      duration: '22s'
    }
  }
});

//only should have dur: 22s
ctr.create('.test-3', base);


//reset back to defualt rc
ctr.setOption({reset: true});

//should === .test-1
ctr.create('.test-4', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
