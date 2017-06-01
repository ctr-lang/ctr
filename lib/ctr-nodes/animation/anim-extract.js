const _                  = require('lodash');
const Immutable          = require('immutable');
const teFlow             = require('te-flow');
const AnimExtractManager = require('./anim-extract-manager.js');
const _H                 = require('../helpers/helper-index.js');

const animExtract = function (animManager) {
  const self = this;

  const extractor = function(_extractMgr) {
    /**
     * Pushes properties into the tnRef from the specified options
     * @param  {obj} trans    -> TransHelper instance
     * @param  {num} opt      -> Prop index to be pushed
     * @param  {num} posIndex -> Sub-cycle index for prop push
     * @param  {str} sVal     -> Value for corrosponing shorthand
     * @return {---}          -> just sets her up.
     */
    const setPropOpt = function (extractMgr, opt, shortVal) {
      /**
       * Figures out and returns the val based on the inputs. Yes I know
       * a usless explination but I'm not sure how else to word this.
       * @param  {str || und} userVal -> User value, or undefined
       * @param  {str} defaultVal     -> default value
       * @return {str}                -> The value which we will use
       */
      const getVal = function (userVal, defaultVal) {
        //set default if no option is specified or the default keyword is used
        if (userVal === 'default') {
          return defaultVal;
        }
        //check for preset ease type
        if (opt === 2) {
          userVal = _H.ease(userVal);
        }
        //und
        if (_.isUndefined(userVal)) {
          return defaultVal;
        }
        return userVal;
      };

      //Assing trans type
      let optKey;
      //duration
      if (opt === 0) { optKey = 'duration'; }
      //delay
      if (opt === 1) { optKey = 'delay'; }
      //timing
      if (opt === 2) { optKey = 'ease'; }
      //count
      if (opt === 3) { optKey = 'count'; }
      //direction
      if (opt === 4) { optKey = 'direction'; }
      //mode
      if (opt === 5) { optKey = 'mode'; }
      //state
      if (opt === 6) { optKey = 'state'; }
      //name
      if (opt === 7) { optKey = 'name'; }

      const res = getVal(
        //option key
        extractMgr.getOption({
          key: optKey,
          user: shortVal
        }),
        //default key
        extractMgr.getDefault(optKey)
      );

      extractMgr.add(optKey, res);
    };

    const genProp = function (extractMgr) {
      //animation gen override
      if (extractMgr.getOption('autoGen') === false) {
        return {
          extractMgr
        };
      }

      /**
       * Configs all shorthand by converting said shortand to longhand,
       * I'm not sure that even makes sense but thats what it does
       * @param  {obj} shorthand -> The shorthand we be working with
       * @return {---}           -> Pushes to transMgr instance
       */
      const convertShorthand = function (shorthand) {
        //shorhand check, if pass cycle
        if (_.isObject(shorthand)) {
          _.forEach(shorthand, function (val, key) {
            //make sure val is not a string
            val = _.isString(val) ? [val] : val;
            //name, check if a name is defined and prioritize that
            setPropOpt(extractMgr, 7, extractMgr.getOption('name') || key);
            //cycle through and assign
            for (let i = 0; i < 7; i++) {
              setPropOpt(extractMgr, i, val[i]);
            }
          });
        }else {
          //throw err if not obj and set shorthand to empty obj
          self.throwErr('shorthandSyntax', shorthand);
          shorthand.setOption({});
        }
      };

      //shorhand opt
      const shorthand = extractMgr.getOption('shorthand');
      if (!_.isEmpty(shorthand)) {
        convertShorthand(shorthand);
      }else {
        //default non-shortand
        for (let i = 0; i <= 7; i++) {
          setPropOpt(extractMgr, i);
        }
      }

      return {
        extractMgr
      };
    };


    //>extractor
    return teFlow.call({
      args: {
        extractMgr: _extractMgr
      }},
      genProp, {
        return: function (extractMgr) {
          if (extractMgr) {
            //we need to return here so passes this val
            //and not an array val
            return extractMgr;
          }
        }
      }
    );
  };

  /**
   * Cycles through the raw data which then is sent off to be extracted
   * with the hope that it will be return clean shaved and processable.
   * @param  {cls} animManager -> A soul of souls who handles all who pass
   *                               through its gates.
   * @return {set}              -> A configured set of trans props who are
   *                               dying to be assigned a home
   */
  let animList = Immutable.List();
  let target = animManager.next();
  while (target) {
    const extractMgr = new AnimExtractManager(target);
    //extranct and add
    const res = extractor(extractMgr);
    animList = animList.push(res);
    //next key
    target = animManager.next();
  }

  return {
    animList
  };
};


module.exports = animExtract;
