const fs   = require('fs');
const path = require('path');
const del  = require('del');
const _    = require('lodash');
const CTR  = require('ctr').js;

/*
Helpers
 */
const normalizeContent = function (str) {
  return str.replace(/\r/g, '').trim();
};
const readFile = function (_path) {
  return normalizeContent(fs.readFileSync(_path, 'utf-8'));
};

const ctr  = new CTR();

//source map info
const sourcemapName = 'sourcemap-i-think?.css';
const sourcemapPath = path.join(__dirname, 'sourcemap-i-think?.css.map');

//del source map, so that we know that shits realz
del.sync(sourcemapPath);

//http://stylus-lang.com/docs/sourcemaps.html
//can be true or a object withh options
ctr.setOption({
  sourcemap: {
    comment: true
  },
  //soucemap file name
  filename: sourcemapName
});

//Important!!! sourcemap is not auto
//set custom callback to write out the source map
ctr.setCallback(function (err, res, style, memoized) {
  if (err) {
    throw err;
  }

  /*
  The important part we have to write out the source map
   */
  fs.writeFileSync(sourcemapPath, style.sourcemap.mappings);

  /*
  Default callback steps
   */

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

/*
Creates styles
 */
ctr.create('.test-1', {
  width: '200px',
  color: 'red',
  height: '400px'
});

ctr.create('.test-2', {
  width: '400px',
  color: 'blue',
  height: '800px'
});

//get res
const res = ctr.getRes();

//gets exp css
const cssFile = path.join(__dirname, 'basic.css');
const exp = fs.existsSync(cssFile) ? readFile(cssFile) : false;
//get our source map
const sourcemap = fs.existsSync(sourcemapPath) ? readFile(sourcemapPath) : false;
const sourcemapSould = 'AAWK;EAXG,OAAM,KAAN;EAAW,OAAM,MAAN;EAAY,QAAO,MAAP';
const sourcemapEqual = sourcemap === sourcemapSould;

module.exports = {
  exp: function () {
    normalizeContent(exp).trim().should.equal(normalizeContent(res).trim());
    //not sure why the normal compaision fucks up, but at this point I don't care
    sourcemapEqual.should.equal(true);
  }
};
