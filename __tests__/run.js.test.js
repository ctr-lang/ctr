const _      = require('lodash');
const fs     = require('fs');
const glob   = require('glob-all');
const should = require('should');
const path   = require('path');
const del    = require('del');
const colur  = require('colur');

const normalizeContent = function (str) {
  return str.replace(/\r/g, '').trim();
};
const readFile = function (_path) {
  return normalizeContent(fs.readFileSync(_path, 'utf-8'));
};
const fileExists = function (filePath) {
  try {
    return fs.statSync(filePath).isFile();
  }catch (err) {
    return false;
  }
};



const addTest = function (testFile) {
  //gets the txt file assosiated with test
  const itShould = readFile(testFile.replace('.js', '.md'));
  //config css res file is present
  const cssFile = testFile.replace('.js', '.css');
  const cssExp = fs.existsSync(cssFile) ? readFile(cssFile) : false;

  describe(testFile, function () {
    it(itShould, function () {
      //dynamically require test
      let {exp, res} = require('.' + testFile.slice(11));
      //check and reasing if cssExp
      exp = cssExp && !_.isFunction(exp) ? cssExp : exp;
      //if no result assume expected is a assertion funk
      if (_.isFunction(exp)) {
        exp(should);
      }else {
        normalizeContent(exp).trim().should.equal(normalizeContent(res).trim());
      }
    });
  });
};



const runTests = function () {
  const ctrrcPath = path.join(process.cwd(), '.ctrrc.yml');
  describe('JS:test', function () {
    before('JS:test', function () {
      colur('__tests__/run.js.test.js:::test -> START');
    });
    //glob and run
    const testGlob = glob.sync(['./__tests__/cases-api/**/*.js', '!./__tests__/cases-api/**/helpers.js']);
    _.forEach(testGlob, function (testFile) {
      if (!testFile.match('_helpers')) {
        addTest(testFile);
      }
    });
    //check if .ctrrc existis and del if so after each test
    afterEach(function () {
      if (fileExists(ctrrcPath)) {
        del.sync(path.join(ctrrcPath));
      }
    });

    after('JS:test', function () {
      colur('__tests__/run.js.test.js:::test -> END', {end: true});
    });
  });
};
runTests();

