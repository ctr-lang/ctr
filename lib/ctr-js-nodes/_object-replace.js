const _     = require('lodash');
const fuzzy = require('./../util/fuzzy-error.js');


/**
* REcursivly search an Object and its values for the matching string patterns
* and or for merge/mergeWith keys. Its structored like it is for readiblity
* and par-performace otherwise its just to cyptic
* @param  {obj}  _source                 -> the Origin of the Source Object
* @param  {obj}  replacer                -> the replacer Object contains the
*                                           values witch we pattern match against
* @param  {bln} options.privateReplacer  -> if using a privateReplace pattern
* @param  {bln} options.reportError      -> to report/process errors
* @param  {bln} options.localVarUpdate      -> updates the replacer object ($$), as in it
*                                           replaces the replacer with replaced vars
* @return {obj}                          -> one converted Object
*/
const _objectReplace = function (_source, replacer, {privateReplacer = false, reportError = false, localVarUpdate = false} = {}) {
  const self = this;
  let replaceVars = null;
  //pattern $<var>$
  //private patter _$<var>$_
  const pattern = privateReplacer ? /_\$([^ \s]*?)\$_/g : /\$([^ \s]*?)\$/g;
  const mergeRun = replacer === false;
  //config prop replace, true by defualt
  let propVariable = self.globalOption.get('propertyVariable') === false || self.globalOption.get('propVariable') === false;
  propVariable = propVariable ? propVariable : self._h.get(replacer, ['propertyVariable', 'propVariable']) === false;
  propVariable = !propVariable;

  /**
   * Simple wraper to check/fix format of merge vars and report errors
   * and it prevents nasty stylus parser errors
   * @param  {---} res -> result
   * @param  {---} key -> result key || udf
   * @return {---}     -> {res, error}
   */
  const mergeCheck = function (res, {key, sourceObj}) {
    let error = false;
    const dKey = () => _.includes(['merge', 'mergeWith', 'mergeWithArray'], key);
    //var not found in local look-up
    if (res === '"$var-not-found$"') {
      error = true;
      key = _.isString(key) && !dKey() ? key : '$merge-not-found$';
      res = '"$merge-var-not-found$"';
      //need to slice off $'s and remove dots due to stylus parser
      res = {[key.slice(1, -1).replace(/\./g, '-')]: res};
    }
    //if function invoke it and bind ctr and pass current context
    res = !_.isFunction(res) ? res : res.call(self, sourceObj);
    //format check which can only occur in raw merge
    if (!_.isPlainObject(res) && !(_.isArray(res) && _.every(res, _.isPlainObject))) {
      error = true;
      const typeOf = _.isArray(res) ? 'Array' : typeof res;
      //throw error wrong formate must be obj
      self._throwErr({
        error: 'Wrong merge varible format',
        msg: `| Merge can only merge Object varibles, but the value for "${key}"
            | is "${res}" which is a ${typeOf}.  Defaulting to ---> {var-key: "$merge-var-wrong-format$"}`,
        format: false
      });
      key = _.isString(key) && !dKey() ? key : '$merge-wrong-format$';
      res = {[key.slice(1, -1).replace(/\./g, '-')]: '"$merge-var-wrong-format$"'};
    }
    return {
      res,
      error
    };
  };

  /**
   * Processes merge values and merges them into the sourceObj if valid
   * @param  {obj} sourceObj -> current source object to return
   * @return {obj}           -> sourceObj wiht merge values merged in
   */
  const processMerge = function (sourceObj, option) {
    //convert to array to to make all things the same
    let merge = sourceObj.merge;
    merge = _.isArray(merge) ? merge : [merge];
    //safty check for mergeRun, since we only want to merge objs, and not on private
    if (privateReplacer || mergeRun && !_.every(merge, _.isObject)) { return sourceObj; }
    //get replacerVars, options mutable, need to ensure ref is set back to false
    option.merge = true;
    merge = replaceVars(merge, option);
    option.merge = false;
    //check the merge values
    merge = _.map(merge, function (val) {
      return mergeCheck(val, {key: 'merge', sourceObj}).res;
    });
    //remove merge
    sourceObj = _.omit(sourceObj, 'merge');
    //need to loop through array res to reduce in results
    //to deep merge need be, meh, it is what it is
    for (let i = 0; i < merge.length; i++) {
      sourceObj = _.reduce(merge[i], function (prv, val, key) {
        prv[key] = prv[key] ? self._h.defaultsDeep(prv[key], val) : val;
        return prv;
      }, sourceObj);
    }
    return sourceObj;
  };

  /**
   * Processes mergeWith values and deep mereges them with sourceObj if valid
   * @param  {obj} sourceObj -> current source object
   * @return {obj}           -> sourceObj with mergeWith values merged in
   */
  const processMergeWith = function (sourceObj, option) {
    //convert to array to to make all things the same
    let mergeWith = sourceObj.mergeWith;
    mergeWith = _.isArray(mergeWith) ? mergeWith : [mergeWith];
    //safty check for mergeRun, since we only want to merge objs, and not on private
    if (privateReplacer || mergeRun && !_.every(mergeWith, _.isObject)) { return sourceObj; }
    //merge run we simple rudece merge to build mergeWith
    if (mergeRun) {
      mergeWith = _.reduce(mergeWith, function (prv, val) {
        return self._h.defaultsDeep(prv, mergeCheck(val, {key: 'mergeWith', sourceObj}).res);
      }, {});
    }else {
      //options mutable, need to ensure ref is set back to false
      option.mergeWith = true;
      //default action, replaceVars, then check for errors
      ({res: mergeWith} = mergeCheck(
        replaceVars(mergeWith, option), {
          key: 'mergeWith',
          sourceObj
        }
      ));
      option.mergeWith = false;
    }
    //merge in res and remove mergeWith
    return self._h.defaultsDeep(_.omit(sourceObj, 'mergeWith'), mergeWith);
  };

  /**
   * Cycles mergeWith Array values and sends them off through replaceVars
   * to see if they need to be converted or not
   * @param  {arr} sourceArr -> mergeWith Array
   * @return {obj}           -> returnObj, which contains the searched/converted
   *                            mergeWith values
   */
  const searchMergeWithArray = function (sourceArr, option) {
    option.mergeWith = true;
    //if we are rocking a mergeWith then we go through the array
    //and get each mergeWith value and add it to the rtnObj to be returned
    //to be merged with the original sourceObj
    let returnObj = {};
    for (let i = 0; i < sourceArr.length; i++) {
      let {res, err} = mergeCheck(
        replaceVars(sourceArr[i], option), {
          key: sourceArr[i],
          //false flag
          sourceObj: sourceArr
        }
      );
      if (!err) {
        //need to go through keys to check for dot refs
        //<path>.<to>.<target>.<prop> -> <prop>
        res = _.reduce(res, function (prv, val, key) {
          const dot = key.lastIndexOf('.');
          if (dot !== -1) {
            //slice of dot prefix
            key = key.slice(dot + 1);
          }
          prv[key] = val;
          return prv;
        }, {});
      }
      //merge in res obj
      returnObj = self._h.defaultsDeep(returnObj, res);
    }
    return returnObj;
  };

  /**
   * Cylces Array values and sends them through replaceVars to see if they
   * need to be convered
   * @param  {arr} sourceArr -> source Array we cycling
   * @param  {bln} merge     -> if an Merge key Array
   * @return {arr}           -> converted Array
   */
  const searchArray = function (sourceArr, option) {
    for (let i = sourceArr.length - 1; i >= 0; i--) {
      let res = replaceVars(sourceArr[i], option);
      //check for var not found error and reconstruct the obj for output
      if (_.isString(res) && res.startsWith('"$var-not-found$"')) {
        res = {[res.replace('"$var-not-found$"', '').replace(/\./g, '-')]: '"$merge-var-not-found$"'};
      }
      sourceArr[i] = res;
    }
    return sourceArr;
  };

  /**
   * Cycles the source Object and processes them accordingly, which is either
   * through merge or default - replaceVars
   * @param  {obj} sourceObj -> source Object
   * @return {obj}           -> converted source Object
   */
  const searchObject = function (sourceObj, option) {
    //processing object - loop de loop
    for (const property in sourceObj) {
      if (sourceObj.hasOwnProperty(property)) {
        //construct key path
        const key = !option.key ? property : option.key.concat(`.${property}`);
        option.key = key;
        //if merege, we replace and then merge back in with obj key
        if (property === 'mergeWith' && (!mergeRun || mergeRun && _.isObject(sourceObj[property]))) {
          sourceObj = processMergeWith(sourceObj, option);
        }else if (property === 'merge' && (!mergeRun || mergeRun && _.isObject(sourceObj[property]))) {
          sourceObj = processMerge(sourceObj, option);
        } else if (propVariable) {
          //prop key replace
          const newProp = replaceVars(property, option);
          //if prop has been changed
          if (newProp !== property) {
            sourceObj[newProp] = replaceVars(sourceObj[property], option);
            sourceObj = _.omit(sourceObj, property);
          }else {
            sourceObj[property] = replaceVars(sourceObj[property], option);
          }
        } else {
          //default action
          sourceObj[property] = replaceVars(sourceObj[property], option);
        }
      }
    }
    return sourceObj;
  };

  /**
   * Helper to replace brackets for alternative var syntax
   * @param  {str} str -> string to remove brakcets from need be
   * @return {str}     -> cleaned string
   */
  const replaceBrackets = function (str) {
    if (_.isString(str) && str.includes('[') && str.includes(']')) {
      str = str.replace('[', '');
      str = str.replace(']', '');
    }
    return str;
  };

  /**
   * The magic maker, in the big picture. This guy regexs the strings to see
   * if they match any of our internal vars if so it replcaes and returns
   * @param  {str} sourceStr -> source String in question
   * @param  {bln} merge     -> if origs from merge
   * @param  {bln} mergeWith -> if origs from mergeWith
   * @return {str}           -> replaced String if match or orig
   */
  const searchString = function (sourceStr, {merge, mergeWith, key}, count = 0) {
    const option = arguments[1];
    const match = sourceStr.match(pattern);
    //checks for strings which have multiple match vars -> '$one$ $two$'
    if (match && sourceStr.match(/\$/g).length > 2) {
      const snatchNext = function (str) {
        str = replaceBrackets(str);
        const currentMatch = sourceStr.match(pattern)[0];
        const car = str.indexOf(currentMatch);
        const cdr = str.indexOf(privateReplacer ? '$_' : '$', car + 1);
        const val = str.substring(car, cdr + (privateReplacer ? 2 : 1));
        const res = searchString(val, option, count);
        if (res === '"$var-not-found$"') { return res; }
        return str.replace(val, res);
      };
      //snatch next until no more snatch'n is left
      while (sourceStr.match(pattern)) {
        ++count;
        sourceStr = snatchNext(sourceStr);
        //not found return
        if (sourceStr === '"$var-not-found$"') {
          return sourceStr;
        }
        if (count > self._infyLoopCount) {
          self._throwErr({
            error: `Infinity loop!!! NOOOOOOOOOOOOOOOOOOOOOOOOOOO`,
            msg: `| The Local Varible Object replace has hit a infinity loop for: "${sourceStr}"
            | or it will since its ran ${self._infyLoopCount} times. Either you fucked up or I did,
            | but if I was a betting man... Anyways if you think the fault is on
            | me pull an issue, alternatively, you can bump the this._infyLoopCount varible.
            | Defaulting to "infinity-loop-local-varible-object".`,
            format: false
          });
          return '"infinity-loop-local-varible-object"';
        }
      }
      if (localVarUpdate && _.has(replacer, key)) {
        _.set(replacer, key, sourceStr);
      }
      return sourceStr;
    }
    //we match here first in case the user is tring to
    //plug an array or object onto the dance floor
    if (match) {
      for (let i = 0; i < match.length; i++) {
        const varMatch = replaceBrackets(match[i].substring(1).slice(0, -1));
        if (_.has(replacer, varMatch)) {
          const res = mergeWith
                    ? {[varMatch]: _.get(replacer, varMatch)}
                    : _.get(replacer, varMatch);
          //true for obj or arr
          if (_.isObject(res)) {
            if (localVarUpdate && _.has(replacer, key)) {
              _.set(replacer, key, res);
            }
            return res;
          }
        }
      }
    }
    //If no match/return above assume string and replace
    return sourceStr.replace(pattern, function(raw, prop) {
      //remove alternative bracket syntax
      prop = replaceBrackets(prop);
      if (_.has(replacer, prop)) {
        const res = _.get(replacer, prop);
        if (localVarUpdate && _.has(replacer, key)) {
          _.set(replacer, key, res);
        }
        return res;
      }else if (reportError) {
        //fuzzy this muddy scruffy
        const fuzzyError = fuzzy(prop, _.keys(replacer));
        //only throw error is specified, which is only true in _dataConfig
        const errType = privateReplacer ? '_$extend-var$_' : '$var$';
        const varType = '"$var-not-found$"';
        self._throwErr({
          error: `${errType} not found`,
          msg: `| Could not find: "${prop}" in the ${errType} Object defaulting to ${varType}.
            | Either the local variable does not exists or you misspelled it. I'll run
            | a fuzzy search against all your varibles so you can check if it's the latter.
            | ${fuzzyError}`,
          format: false
        });
        //need to pass along prop for string, deling with an Array
        return merge ? varType.concat(prop) : varType;
      }
      //could not find but return for right now, we only throw/report error
      //at the _dataConfig statge of the game
      return raw;
    });
  };

   /**
    * The magic maker, which recusivly searchers/builds/converts our values
    * Sorry about the recusive mind fuck, things got a little out of
    * hand once, when I decided to factored in error reporting,
    * merging internal/external vars, replacer updater but its worth it like you.
    * @param  {---}  source            -> dependant, could be anythign
    * @param  {bln}  options.key       -> key of the current source
    * @param  {bln}  options.mergeWith -> if mergeWith caller
    * @param  {bln}  options.merge     -> if merge caller
    * @return {obj}                    -> One converted Object
    */
  replaceVars = function (source, {key = false, merge = false, mergeWith = false} = {}) {
    if (source === null) { return null; }
    const option = {key, merge, mergeWith};
    //Search Array
    if (_.isArray(source)) {
      return mergeWith
             ? searchMergeWithArray(source, option)
             : searchArray(source, option);
    }
    //Search Object
    if (_.isPlainObject(source)) {
      return searchObject(source, option);
    }
    //Search String if not merge run
    if (_.isString(source) && !mergeRun) {
      return searchString(source, option);
    }
    //>
    return source;
  };

  //recursive inception, how deep will we go, no one knows
  return replaceVars(_source);
};

module.exports = _objectReplace;
