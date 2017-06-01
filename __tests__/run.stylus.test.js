const _      = require('lodash');
const stylus = require('stylus');
const should = require('should');
const glob   = require('glob-all');
const fs     = require('fs');
const colors = require('colors');
const colur  = require('colur');

const CTR = require('ctr').stylus;
const ctr = new CTR();

/**
 * Helpers
 */
const normalizeContent = function (str) {
  return str.replace(/\r/g, '').trim();
};

const readFile = function (path) {
  return normalizeContent(fs.readFileSync(path, 'utf-8'));
};


let nonTimeNow;
let fullTimeNow;
/**
 * Sets timer
 * @param {str}  testCase -> case
 * @param {bln} before    -> if before test
 */
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
 * The test runner
 * @param {str} dir -> root directory
 */
const addTests = function(testCase, testGlob, option) {

  //test case
  describe(testCase, function () {

    // runs before all tests in this block
    before(testCase, function() {
      colur(`run.stylus.test.js:::test -> START -> ${testCase}`);
      setTimer(testCase);
    });

    // runs after all tests in this block
    after(testCase, function() {
      colur(`run.stylus.test.js:::test -> START -> ${testCase}`, {end: true});
      setTimer(testCase, false);
      if (option.lastTest) {
        //non
        console.info(colors.red.underline.bold('Test Time for Stylus Non_Memoize'));
        console.info(colors.green.bold(nonTimeNow));
        //full
        console.info(colors.red.underline.bold('Test Time for Stylus Full_Memoize'));
        console.info(colors.green.bold(fullTimeNow));
      }
    });

    //cylce tests
    _.forEach(testGlob, function (testFile) {
      //get files
      const styl = readFile(testFile);
      const css  = readFile(testFile.replace('.styl', '.css'));
      const md   = readFile(testFile.replace('.styl', '.md'));
      //set stylus
      const style = stylus(styl).use(ctr);
      //Base level for test
      describe(testFile, function () {
        //run/render test
        it(md, function () {
          //render styles
          style.render(function (err, actual) {
            if (err) {
              throw err;
            }
            actual.trim().should.equal(css.trim());
            //resets, for a new sheet of ice -> resets any opts or vars
            stylus('ctrSetReset()').use(ctr).render();
          });
        });
      });
    });

  });
};

/*-----------------------------*/
/// Test cases
/*-----------------------------*/
/*
Long story short the test are ran three times. First run is without memoize.
The second run we turn the memoize on but since its the inital memoize run
the only duplicate test will be cahced. The finial test all the test should be
cached.
 */
const testGlob = glob.sync([
  './__tests__/cases-core/**/*.styl',
  '!./__tests__/cases-core/**/*.less.styl',
  '!./__tests__/cases-core/**/*.yml.styl'
]);

addTests('Not_Memoize', testGlob, {
  lastTest: false
});
addTests('Full_Memoize', testGlob, {
  lastTest: true
});
