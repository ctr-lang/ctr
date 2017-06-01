const fs   = require('fs'),
      path = require('path'),
      del  = require('del'),
      CTR  = require('ctr').js;

const customRcPath = path.join(__dirname, '/.testRcPath.yml');

//write ctrrc
fs.writeFileSync(customRcPath, `
ctrOption:
  hover:
    duration: 22s`);
const ctr  = new CTR();

ctr.setOption({
  rcPath: customRcPath
});

const res = ctr.create('.test', {
  size: '200px',
  hover: {
    on: {
      width: '400px'
    }
  }
}).getResult();


del.sync(customRcPath);


module.exports = {
  res: res
};
