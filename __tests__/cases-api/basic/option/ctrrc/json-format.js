const path = require('path');
const fs   = require('fs');
const CTR  = require('ctr').js;

const rcObject = {
  variable: {
    delay: '10s',
    size: '800px'
  },
  option: {
    hover: {
      duration: '20s'
    },
    global: {
      sort: '-len'
    }
  }
};

//write ctrrc
fs.writeFileSync(path.join(process.cwd(), '.ctrrc.yml'), JSON.stringify(rcObject));
const ctr  = new CTR();


const res = ctr.create('.test', {
  size: '$size$',
  hover: {
    on: {
      width: '400px',
      option: {
        delay: '$delay$'
      }
    }
  }
}).getResult();

module.exports = {
  res: res
};
