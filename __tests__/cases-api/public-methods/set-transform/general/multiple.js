const CTR  = require('ctr').js;
const ctr  = new CTR();

const base = {
  width: '200px',
  height: '400px',
  background: 'red'
};

//init
ctr.create('.test-1', base);

//set transform -> convert background to background-color
ctr.setTransform(function (res) {
  return res.replace('background', 'background-color');
});

//background-color
ctr.create('.test-2', base);

//lets get serious about css, should build upon prv background-color
ctr.setTransform(function (res) {
  return res.toUpperCase();
});


//upercase + background-color
ctr.create('.test-3', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
