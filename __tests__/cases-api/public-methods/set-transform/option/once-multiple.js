const CTR  = require('ctr').js;
const ctr  = new CTR();

const base = {
  width: '200px',
  height: '400px',
  background: 'red'
};

//init
ctr.create('.test-1', base);

//lets get serious about css
ctr.setTransform(function (res) {
  return res.toUpperCase();
});

//should be uppercase
ctr.create('.test-2', base);

//should build upon toUpperCase
ctr.setTransform(function (res) {
  return res.replace(/background/gi, 'background-color');
}, {once: true});

//should be uppercase and should have background-color
ctr.create('.test-3', base);


//should === .test-2
ctr.create('.test-4', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
