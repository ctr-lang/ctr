const CTR  = require('ctr').js;

const ctr  = new CTR();

const base = {
  width: '200px',
  color: 'red',
  height: '400px'
};

//init
ctr.create('.test-1', base);

//some outside custom fuction
const someCustomThing = function (val) {
  return val.toUpperCase();
};

//sets our callback
ctr.setCallback(function (err, res) {
  if (err) {
    throw err;
  }
  res = !this.transform.length ? res : this._transformData(res);
  //out custom thing
  res = someCustomThing(res);
  this.res = res;
  this._resSetAdd(res);
}, {
  //only do it once
  once: true
});

//shoud be uppercase
ctr.create('.test-2', base);

//should not be upper case === .test-1
ctr.create('.test-3', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
