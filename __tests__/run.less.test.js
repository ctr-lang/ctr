const fs               = require('fs-extra');
const _                = require('lodash');
const less             = require('less');
const glob             = require('glob-all');
const should           = require('should');
const colors           = require('colors');
const colur            = require('colur');
const lessClean        = require('./run.less.clean.js');
const lessBuild        = require('./run.less.build.js');
const cleanLessPlugins = require('./run.less.plugin-helpers.js');
const CTR              = require('ctr');
const ctr              = CTR.less;


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
 * Our testing less ctr instance
 */
const ctrLess = ctr({
  syntaxStylus: true,
  SYNTAX_YAML: true
});
/**
 * Used to clean the resulting less output so that is
 * matches stylus, nothing major just some space shite
 */
const cleanLess = cleanLessPlugins();

/**
 * prepended to every test to reset and set options or variables of prv test
 */
const lessReset = `

// stylus
ctrSetReset()

// yaml
ctrSetReset({
  // SYNTAX_YAML
})
`;




/**
 * Yaml test runner. It used the ctr to processes the styles
 * and runs twice to check for memoizing faults
 * @param  {str}  testCase -> case
 * @param  {bln}  lastTest -> last test or not
 * @return {---}           -> the  word
 */
const lessTest = function (testCase = 'Not_Memoize', lastTest = false) {
  const testGlob = glob.sync('__tests__/cases-core/**/*.less');

  //test memoize or not
  describe(testCase, function () {

    // runs before all tests in this block
    before(testCase, function() {
      colur(`run.less.test.js:::test -> START -> ${testCase}`);
      setTimer(testCase);
    });

    // runs after all tests in this block
    after(testCase, function() {
      colur(`run.less.test.js:::test -> END -> ${testCase}`, {end: true});
      setTimer(testCase, false);

      if (lastTest) {
        //non
        console.info(colors.red.underline.bold('Test Time for Less Non_Memoize'));
        console.info(colors.green.bold(nonTimeNow));
        //full
        console.info(colors.red.underline.bold('Test Time for Less Full_Memoize'));
        console.info(colors.green.bold(fullTimeNow));
      }else {
        debugger
        //call again to run memeoized tests
        lessTest('Full_Memoize', true);
      }
    });

    //test cycle and run
    describe('LESS:test -> ' + testCase, function () {
      //cylce tests
      _.forEach(testGlob, function (lessLoc) {
        describe(lessLoc.replace(/.{1,}ctr\//gi, ''), function () {
          //get testing assets
          let lessFile   = readFile(lessLoc);
          //reasing need be
          lessLoc = lessLoc.includes('less-yml.less')
                  ? lessLoc.replace('less-yml.', '')
                  : lessLoc;
          const cssFile  = readFile(lessLoc.replace('.less', '.css'));
          const itShould = readFile(lessLoc.replace('.less', '.md'));
          //prepend the reset styles
          lessFile = lessReset + lessFile;

          //run/render test
          it(itShould, function (done) {
            less.render(lessFile, {
              plugins: [ctrLess, cleanLess],
              async: false,
              fileAsync: false,
              strictMath: 'on'
            })
            .then(function (res) {
              if (res.css.trim() !== cssFile.trim()) {
                console.log(lessFile)
                debugger
              }
              res.css.trim().should.equal(cssFile.trim());
              done();
            })
            .catch(function (err) {
              done(err);
              throw err;
            });
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
const init = _.flow([lessClean, lessBuild, lessTest]);
init();

