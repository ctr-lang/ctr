const _     = require('lodash');
const glob  = require('glob-all');
const del   = require('del');
const colur = require('colur');

/**
 * Removes all *less files
 */
const lessClean = function () {
  colur('__tests__/run.less.clean.js:::clean -> START');
  const lessTestGlob =  glob.sync([
    '__tests__/cases-core/**/*.less',
    '!__tests__/cases-core/less/**',
    '!__tests__/cases-core/ctr-set/**'
  ]);
  //cycle through files
  _.forEach(lessTestGlob, function (loc) {
    del.sync(loc);
  });

  colur('__tests__/run.less.clean.js:::clean -> END', {end: true});
};


//if we are calling from a script invoke the funk
if (process.env.NPM) {
  lessClean();
}


module.exports = lessClean;
