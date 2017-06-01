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
const replaceTransform = function (res) {
  return res.replace('background', 'background-color');
};

const toUpperCase = function (res) {
  return res.toUpperCase();
};

const transformArray = [replaceTransform, toUpperCase];

ctr.setTransform(transformArray);


//both should be upper case and bg replace
ctr.create('.test-2', base);
ctr.create('.test-3', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
