const _         = require('lodash');
const Immutable = require('immutable');
const util      = require('./helper-util.js');
const _M        = require('../manager/manager-index.js');

/**
 * Not going to lie this sorta melted my mind a bit to recursive for my taste.
 * The basic gist is we need to recusivly find/check if a key exsits in the obj
 * and if it does remove the key and its value from said object.
 * @param  {obj} obj        -> raw data obj
 * @param  {arr} keys       -> An array of keys
 * @param  {bln} removeKey  -> to remove key and value from return obj
 * @return {obj}            -> cleaned prbly of key
 */
const findKey = function (obj, keys, option = {}) {
  option = _.defaults(option, {
    removeKey: true,
    processAnim: false,
    moveGlobal: false,
    addToStatic: false,
    addToOption: false,
    depth: 0
  });
  let removeKey   = option.removeKey;
  let processAnim = option.processAnim;
  let moveGlobal  = option.moveGlobal;
  let addToOption = option.addToOption;
  let optionKey   = option.optionKey;
  let lookupDepth = option.depth;


  /**
   * This is just a recusive funk to see if the key exsits in the obj
   * but the catch is we need to keep track of the path so we can latter remove
   * the key/val from the object need be. I'm not sure if there is an easier way
   * to do this but fuck it, I'm fucking done with this funk, I'm happy enough.
   * @param  {obj}  _obj      -> data obj
   * @param  {str}  _key      -> key for which we are looking to see if a val
   *                             is present in obj
   * @param  {arr}   keyPath  -> The current path of the object
   *                             ex. {one: {two: ...} => ['one', 'two']
   * @param  {arr}  rootKeys  -> The base root keys for the objected needed to
   *                             keep of the path
   * @param  {num}  keyLength -> For slicing bullshit
   * @return {obj || fasle}   -> Depends if it finds shit.
  */
  const hasKey = function (_obj, _key, keyPath = [], rootKeys, keyLength = 0, depth = 0) {
    //set init rootKey
    rootKeys = rootKeys ? rootKeys : _.keys(_obj);
    //if key exsists in cur obj rtn
    if (_obj[_key]) {
      keyPath.push(_key);
      let val = _obj[_key];
      return {
        val,
        keyPath
      };
    }

    //Cycle through obj keys
    for (let p in _obj) {
      //eslint tells me I should do this, I really should just forEach
      //but when in rome
      if ({}.hasOwnProperty.call(_obj, p)) {
        //verify we are working with a obj
        if (_.isObject(_obj[p])) {
          //push in current key at hand
          keyPath.push(p);
          //check to make sure path exisits in original obj, note this is not `_obj`
          if (!_.has(obj, keyPath)) {
            //if key is OG then set it
            if (_.includes(rootKeys, p)) {
              keyPath = [p];
            }else {
              //Otherwise we take a step back and slice off the end depending
              //on how deep we are so we can push on the new to key to check
              //if it exsits otherwiser we revert back to the OG rootkey
              keyPath = keyPath.slice(0, (keyLength * -1));
              keyPath.push(p);
              if (!_.has(obj, keyPath)) {
                keyPath = [keyPath[0]];
              }
            }
          }
          //bump depth
          depth += 1;
          let res;
          //The recurive magic
          if (lookupDepth !== 0 && depth < lookupDepth) {
            res = hasKey(_obj[p], _key, keyPath, rootKeys, keyPath.length, depth);
          }
          //no depth limit
          if (lookupDepth === 0) {
            res = hasKey(_obj[p], _key, keyPath, rootKeys, keyPath.length, depth);
          }
          if (res) {
            return res;
          }
        }
      }
    }
    //default
    return false;
  };


  /**
   * This baby removes the key/val, using the keyPath from our hasKey funk
   * not sure if this is the best way to do this as well but like I said before
   * I am done working on this funk. Its recursive too.
   * @param  {obj} _obj -> object which remove key/val
   * @param  {arr} path -> made up of string, its our path reffrance
   * @return {obj}      -> cleaned of key/val
   */
  const removeObjKey = function (_obj, path) {
    //reduce and reuse in life.
    return _.reduce(path, function (prv, key, index, list) {
      if (!key) {
        return prv;
      }else if (list.length === 1) {
        if (processAnim && (key === 'anim' || key === 'animation')) {
          //if we get here this means there is a global animation within the
          //state, ie hover: {anim: {..}} so we place that anim within a
          //on object for that state and throw it back into the queueu to be
          //processed as such
          let animProps = _.cloneDeep(prv[key]);
          //format object to be prossed
          animProps = {[option.key]: {on: {
            animation: animProps
          }}};
          //process animation via throwing it back into queue
          _M._queue.add(Immutable.fromJS({
            data: animProps,
            target: option.target
          }));

          return _.omit(prv, key);
        }
        //backs key out and places in parent
        if (moveGlobal) {
          let globalVal = prv[key];
          let _prv = _.omit(prv, key);
          return _.defaults(_prv, globalVal);
        }
        return _.omit(prv, key);
      }
      path.shift();
      //recursive magic
      prv[key] = removeObjKey(_obj[key], path);
      return prv;
    }, _obj);
  };

  //Loop though the key array
  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let res = hasKey(obj, key);
    if (res) {
      let keyVal = res.val;
      //remove key
      if (removeKey) {
        obj = removeObjKey(obj, res.keyPath);
      }
      //add to option obj
      if (addToOption) {
        let optKey = optionKey || key;
        if (!obj.option) {
          obj.option = {[optKey]: keyVal};
        }else {
          obj.option = util.merge(obj.option, {[optKey]: keyVal});
        }
      }
      return {
        data: obj,
        keyVal: keyVal
      };
    }
  }

  return {
    data: obj,
    keyVal: null
  };
};

module.exports = findKey;
