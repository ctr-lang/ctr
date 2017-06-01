const _  = require('lodash');

/**
 * The eval plugin is for eval Object evaluations for the local vars which can
 * be helpful for yaml centric projects. Anything more advanced should be done
 * in js.
 * @param  {obj} _data -> local var data
 * @return {obj}       -> evaluated local var data if eval Object
 */
const evalPlugin = function(_data) {

  /**
   * Evaluates str so that we can do some maths within our eval
   * kinda hacky but this whole this is hacky, tied to #365
   * @param  {str} str -> arith(str)
   * @return {num}     -> evaled
   */
  const arith = function (str) {
    //safe check
    if (!str || !_.isString(str) || !str.match(/arith\((.*?)\)/g)) {
      return str;
    }
    //get string match
    const arithStrOrig = str.match(/arith\((.*)\){1,}/g)[0];
    let arithStr = arithStrOrig;
    //find prefix if any
    let prefix = arithStr.match(/\)\S\w{1,}$/);
    prefix = prefix ? prefix[0].replace(')', '') : false;
    //remove arith
    arithStr = arithStr.slice(5);

    //stupid bracket shit
    let brackCountR = arithStr.match(/\(/g).length;
    let brackCountL = arithStr.match(/\)/g).length;
    if (brackCountR - brackCountL > 0) {
      for (let i = brackCountR - brackCountL - 1; i >= 0; i--) {
        arithStr = arithStr.replace(/\(/, '');
      }
    }else if (brackCountL - brackCountR > 0) {
      for (let i = brackCountL - brackCountR - 1; i >= 0; i--) {
        arithStr = arithStr.replace(/\)/, '');
      }
    }

    //shitty way to extract `Math` not sure how else to do it
    //I can't figure out the regex
    let regInc = arithStr.match(/Math\.\w{1,}\((.*?)\)/g);
    regInc = regInc ? regInc : arithStr.match(/((Math)+\b.\S*)/g);
    const tempMath = {};
    _.forEach(regInc, function (val) {
      const tempKey = '__' + (Math.floor(Math.random() * 100000) + 1) + '__';
      tempMath[tempKey] = val;
      //janky ass shit cus I can't regex
      const tempStr = arithStr.split(' ');
      for (let i = 0; i < tempStr.length; i++) {
        if (tempStr[i] === val) {
          tempStr[i] = tempKey;
        }
      }
      arithStr = tempStr.join(' ');
    });

    //remove all non-digis
    arithStr = arithStr.replace(/[a-zA-Z]/g, '');
    //remove all other `arith`
    arithStr = arithStr.replace(/arith/g, '');
    //remove all other `math`
    arithStr = arithStr.replace(/math/g, '');
    arithStr = arithStr.replace(/kalc/g, '');
    //replace any Math
    if (!_.isEmpty(tempMath)) {
      const mathKeys = _.keys(tempMath);
      _.forEach(mathKeys, function (val) {
        const regReplace = new RegExp(val, 'g');
        arithStr = arithStr.replace(regReplace, tempMath[val]);
      });
    }
    //eval
    arithStr = eval(arithStr);
    // to fixes and remove 0s need be
    arithStr = parseFloat(arithStr.toFixed(4));
    //tack on prefix
    arithStr = prefix ? (arithStr + prefix) : arithStr;
    //replace artithStr
    str = str.replace(arithStrOrig, arithStr);
    //fucking shit need this fucking saftey this is stupid and a waste of my time
    brackCountR = str.match(/\(/g);
    brackCountL = str.match(/\)/g);
    brackCountR = brackCountR ? brackCountR.length : 0;
    brackCountL = brackCountL ? brackCountL.length : 0;
    if (brackCountR > brackCountL) {
      str += ')';
    }
    return str;
  };

  /**
   * Not a big fan of this, but basically, we need to see if there are
   * any above arith refs that have already been processed that are in our
   * current string.
   * ie. {one: arith(x), two: '2 + $one$'} -> replaces two's arith ref with answer
   * @param  {str} str -> arith string to process/check for previous arith refs
   * @return {str}
   */
  const checkStore = [];
  const checkAndReplacePrvArith = function (str) {
    /**
     * Helper to escape strings properly
     * @param  {str} val -> string to escape
     */
    const escapeStringRegExp = function(val) {
      const matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;
      return val.replace(matchOperatorsRe, '\\$&');
    };

    //cylces through checkStore for any arith(*) matches, and if so it replaces
    _.forEach(checkStore, function (val) {
      const checkVal = new RegExp(_.keys(val)[0], 'g');
      if (str.match(checkVal)) {
        str = str.replace(checkVal, _.values(val)[0]);
      }
    });

    //set in store, and process arith
    const escaped = escapeStringRegExp(str);
    const res = arith(str);
    checkStore.push({[escaped]: res});
    return res;
  };

  /**
   * Check and then converts any eval aux values need be
   * @param  {str} val -> val string
   * @return {---}     -> val string converted, and if a return value
   *                      should be processed
   */
  const evalConvert = function (string) {
    if (string.includes('kalc') || string.includes('calc')) {
      string = string.slice(4);
      string = 'calc' + string;
      //remove all other `kalc`
      string = string.replace(/kalc/g, '');
      //remove all other occurence except for first
      string = string.replace(/(?!^)calc/g, '');
    }
    if (string.includes('arith')) {
      //eval
      string = checkAndReplacePrvArith(string);
    }
    if (string.startsWith('funk') || string.startsWith('func')) {
      string = string.slice(4);
      string = eval(string);
      //if instance of function inkove
      if (_.isFunction(string)) {
        string = string();
      }
    }
    return string;
  };

  /**
   * Recusivly serches eval Object and converts any data need be
   * @param  {obj} data -> data object to eval
   * @return {obj}      -> object with eval values
   */
  const evalSearch = function (data) {
    return _.reduce(data, function (curPrv, val, key) {
      if (_.isObject(val)) {
        curPrv[key] = evalSearch(val);
      }else if (_.isString(val)) {
        curPrv[key] = evalConvert(val);
      }
      return curPrv;
    }, data);
  };


  //check for eval object
  if (_.has(_data, 'eval') && _.isPlainObject(_data.eval)) {
    _data.eval = evalSearch(_data.eval);
    return _data;
  }

  //no eval object to evaluate
  return _data;
};

module.exports = evalPlugin;
