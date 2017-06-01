const _    = require('lodash');
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
ctr.setCallback(function (err, res, style, memoized) {
  if (err) {
    throw err;
  }
  res = someCustomThing(res);
  //check for sourcemap, if so add some beathing room
  res = !_.has(style, 'sourcemap') ? res : '\n' + res;
  //transform the data if present
  res = !this.transform.length ? res : this._transformData(res, memoized);
  //set ref
  this.res = res;
  //set the res for the map, key is already
  //set and stored at this.resultKey
  //we only set the set-res if there is no stylus error
  //-stylus error occure when there is something like a infy loop
  //-or wrong var name. This was the error is not swallow up
  this._resSetAdd(res, this.resultKey, !global._ctrNodeError_);
});


//shoud be uppercase
ctr.create('.test-2', base);

//should also be upper case
ctr.create('.test-3', base);


const res = ctr.getRes();

module.exports = {
  res: res
};
