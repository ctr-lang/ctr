const fs   = require('fs');
const path = require('path');
const _    = require('lodash');
const yaml = require('js-yaml');

/**
 * Lookes for `.ctrrc.js` file in the root of the directory
 * for preconfiged ctr optins
 * @param  {str} prvFilePath     -> the prvious sucssful path look up to avoid
 *                                  needless lookup calls
 * @param  {str} rcPath         -> custom rc path defined by user
 * @param  {str} instanceOption -> new ctr instance options
 * @return {obj}                -> ctr options of empy object
 */
const config = function({prvFilePath = null, rcPath = null, localVarKey = '$$', instanceOption = false}) {
  const self = this;
  const fileName = '.ctrrc.yml';

  /**
   * Wrapper to check if file exsits
   * @param  {str} filePath -> filepath
   * @return {bln}          -> the truth
   */
  const fileExists = function (filePath) {
    try {
      return fs.statSync(filePath).isFile();
    }catch (err) {
      return false;
    }
  };

  /**
   * Wrapper around yaml.load to parse the ctrrc file
   * @param  {str} filePath -> filepath to the ctrrc
   * @return {---}          -> obj of results or throws error
   */
  const parseFile = function (filePath) {
    try {
      return yaml.safeLoad(fs.readFileSync(filePath));
    }catch (err) {
      //currently not implment in stylus
      if (self._throwErr) {
        //throw error
        self._throwErr({
          error: '.ctrrc.yml parse error! You need to fix your .ctrrc file!',
          msg: err
        });
      }else {
        console.warn('.ctrrc.yml parse error! You need to fix your .ctrrc file!');
        console.warn(err);
      }
      return false;
    }
  };

  /**
   * Process the ctrrc.yml file and assings the vars
   * @param  {str} filePath -> filepath to crtrc
   * @return {obj}          -> configed rc options
   */
  const requireCtr = function (filePath) {
    const hasRc = _.isString(filePath);
    //read andparse the file
    let ctrRc = hasRc ? parseFile(filePath) : {};
    // stats for ref return
    const rcStats = hasRc ? {rcFilePath: filePath, rcMtime: fs.statSync(filePath).mtime} : {};
    //merge in new ctr instance options
    ctrRc = _.isPlainObject(instanceOption) ? _.defaultsDeep(_.cloneDeep(instanceOption), ctrRc || {}) : ctrRc;
    //config need be otherwise return the dice
    if (_.isPlainObject(ctrRc)) {
      //pull out config objects if any
      let varsConfig = ctrRc[localVarKey] || ctrRc.variable || {};
      //check file specific condidtion -> means all props are options, filter option of course
      if (varsConfig === true) {
        varsConfig = _.omit(ctrRc, ['$ctr-option', 'ctrOption', 'option']);
      }
      let globalOption =  ctrRc['$ctr-option'] || ctrRc.ctrOption || ctrRc.option || {};
      //check file specific condidtion -> means all props are options
      if (globalOption === true) {
        globalOption = _.isEmpty(varsConfig) && _.isEmpty(globalOption) ? ctrRc : globalOption;
      }
      //default catch-all, assumes all props are options
      globalOption = _.isEmpty(varsConfig) && _.isEmpty(globalOption) ? ctrRc : globalOption;
      //check for global key, merge into base, unforunatly we need to duplicate the data right now
      globalOption = !_.isPlainObject(globalOption.global) ? globalOption : _.defaultsDeep(globalOption, globalOption.global);
      return _.defaults({
        rcVars: varsConfig,
        rcGlobalOption: globalOption
      }, rcStats);
    }else if (_.isUndefined(ctrRc)) {
      //if undefined in all likelihood its just empty so we still return file info
      return _.defaults({
        rcVars: {},
        rcGlobalOption: {}
      }, rcStats);
    }
    return {
      rcVars: {},
      rcGlobalOption: {}
    };
  };

  //check if user specied a custom path otherwise check prvFilePath
  //for the a prvFilePath
  if (rcPath) {
    return requireCtr(rcPath);
  }else if (prvFilePath) {
    return requireCtr(prvFilePath);
  }

  //home check
  const home = path.resolve(__dirname).split('/node_modules')[0];
  if (home) {
    const homeExists = fileExists(path.join(home, fileName));
    if (homeExists) {
      return requireCtr(path.join(home, fileName));
    }
  }

  //argv check
  let argv = process ? process.argv : false;
  argv = argv ? argv[1] : argv;
  if (argv) {
    const argvExists = fileExists(path.join(home, fileName));
    if (argvExists) {
      return requireCtr(path.join(home, fileName));
    }
  }

  //process check
  const processExists = fileExists(path.join(process.cwd(), fileName));
  if (processExists) {
    return requireCtr(path.join(process.cwd(), fileName));
  }

  //instance option
  if (instanceOption) {
    return requireCtr(instanceOption);
  }

  //non, return to asing
  return {
    rcVars: {},
    rcGlobalOption: {}
  };
};

module.exports = config;

