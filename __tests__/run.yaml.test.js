const _         = require('lodash');
const fs        = require('fs-extra');
const glob      = require('glob-all');
const should    = require('should');
const colors    = require('colors');
const colur     = require('colur');
const yamlClean = require('./run.yaml.clean.js');
const yamlBuild = require('./run.yaml.build.js');
const CTR       = require('ctr').js;

/*
Helpers
 */
const normalizeContent = function (str) {
  return str.replace(/\r/g, '').trim();
};
const readFile = function (path) {
  return normalizeContent(fs.readFileSync(path, 'utf-8'));
};


/**
 * Sets timer
 * @param {str}  testCase -> case
 * @param {bln} before    -> if before test
 */
let nonTimeNow;
let fullTimeNow;
const setTimer = function (testCase, before = true) {
  if (before) {
    if (testCase === 'Not_Memoize') {
      nonTimeNow = new Date().getTime();
    }else if (testCase === 'Full_Memoize') {
      fullTimeNow = new Date().getTime();
    }
    return;
  }
  //end
  if (testCase === 'Not_Memoize') {
    nonTimeNow = (new Date().getTime() - nonTimeNow) / 1000;
  }else if (testCase === 'Full_Memoize') {
    fullTimeNow = (new Date().getTime() - fullTimeNow) / 1000;
  }
};


/**
 * Yaml test runner. It used the ctr to processes the styles
 * and runs twice to check for memoizing faults
 * @param  {str}  testCase -> case
 * @param  {bln}  lastTest -> last test or not
 * @return {---}           -> the  word
 */
const ctr = new CTR({
  //set option to allow duplicate styles in the set
  duplicateCSS: true
});

const yamlTest = function (testCase = 'Not_Memoize', lastTest = false) {
  const testGlob = glob.sync('__tests__/cases-core/**/*.yml');

  //test memoize or not
  describe(testCase, function () {

    // runs before all tests in this block
    before(testCase, function() {
      colur(`run.yaml.test.js:::test -> START -> ${testCase}`);
      setTimer(testCase);
    });

    // runs after all tests in this block
    after(testCase, function() {
      colur(`run.yaml.test.js:::test -> END -> ${testCase}`, {end: true});
      setTimer(testCase, false);

      if (lastTest) {
        //non
        console.info(colors.red.underline.bold('Test Time for YAML Non_Memoize'));
        console.info(colors.green.bold(nonTimeNow));
        //full
        console.info(colors.red.underline.bold('Test Time for YAML Full_Memoize'));
        console.info(colors.green.bold(fullTimeNow));
      }else {
        //call again to run memeoized tests
        yamlTest('Full_Memoize', true);
      }
    });

    //test cycle and run
    describe('YAML:test -> ' + testCase, function () {
      //cylce tests
      _.forEach(testGlob, function (yamlLoc) {
        describe(yamlLoc.replace(/.{1,}ctr\//gi, ''), function () {
          //get css
          const css = readFile(yamlLoc.replace('.yml', '.css'));
          const itShould = readFile(yamlLoc.replace('.yml', '.md'));

          //run/render test
          it(itShould, function () {
            const res = ctr.yaml(yamlLoc).getRes();
            res.trim().should.equal(css.trim());
            //resets, for a new sheet of ice -> resets any opts or vars
            ctr.setReset();
          });
        });
      });
    });
  });

};


/**
 * Init pipeline flow Caller
 * -> calls funks in order
 */
const init = _.flow([yamlClean, yamlBuild, yamlTest]);
init();

