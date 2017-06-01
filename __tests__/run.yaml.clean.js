const _       = require('lodash');
const glob    = require('glob-all');
const del     = require('del');
const colur   = require('colur');

/**
 * Removes alll *yaml files
 */
const yamlClean = function () {
  colur('run.yaml.clean.js:::clean -> START');
  const yamlTestGlob =  glob.sync([
    '__tests__/cases-core/**/*.yml',
    '!__tests__/cases-core/ctr-set/**'
  ]);
  //cycle through files
  _.forEach(yamlTestGlob, function (yamlSrc) {
    del.sync(yamlSrc);
  });
  colur('run.yaml.clean.js:::clean -> END', {end: true});
};


//if we are calling from a script invoke the funk
if (process.env.NPM) {
  yamlClean();
}


module.exports = yamlClean;
