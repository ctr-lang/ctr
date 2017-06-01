const _                   = require('lodash');
const teFlow              = require('te-flow');
const Immutable           = require('immutable');
const TransExtractManager = require('./trans-extract-manager.js');
const _H                  = require('../helpers/helper-index.js');


const transExtract = function (transManager) {
  const self = this;
  //hacky as fuck way to check for dupluication but I had to implement at
  //the end of the game
  const globalPropList = [];

  const extractor = function(_extractMgr) {
    /**
     * Pushes properties into the tnRef from the specified options
     * @param  {obj} trans    -> TransHelper instance
     * @param  {num} opt      -> Prop index to be pushed
     * @param  {num} posIndex -> Sub-cycle index for prop push
     * @param  {str} shortVal     -> Value for corrosponing shorthand
     * @return {---}          -> just sets her up.
     */
    const setPropOpt = function (extractMgr, [opt, posIndex], shortVal) {
      /**
       * Figures out and returns the val based on the inputs. Yes I know
       * a usless explination but I'm not sure how else to word this.
       * @param  {str || und} userVal -> User value, or undefined
       * @param  {str} defaultVal     -> default value
       * @return {str}                -> The value which we will use
       */
      const getVal = function (userVal, defaultVal) {
        //for multi index, sorta silly honestly like kids these days
        userVal = _.isNumber(posIndex) && _.isArray(userVal)
                  ? userVal[posIndex]
                  : userVal;
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
      //ease
      if (opt === 2) { optKey = 'ease'; }

      const res = getVal(
        //option key
        extractMgr.getOption({
          key: optKey,
          user: shortVal
        }),
        //default key
        extractMgr.getDefault(optKey)
      );

      //add result
      extractMgr.add(optKey, res);

    };

    /**
     * #configOption
     * Configures the props that are defined such as shortand
     * @param  {map} transMgr -> transMgr instance
     * @return {map}       -> transMgr instance
     */
    const configOption = function(extractMgr) {
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
            if (val !== false) {
              //make sure val is not a string
              val = _.isString(val) ? [val] : val;
              //check to make sure prop non in global list
              //so that we don't create duplication
              if (!_.includes(globalPropList, key)) {
                globalPropList.push(key);
                //property
                extractMgr.add('property', key);
                //cycle through and assign
                for (let i = 0; i < 3; i++) {
                  setPropOpt(extractMgr, [i], val[i]);
                }
              }
            }else {
              //add to omit list
              extractMgr.updateOmit(key);
            }
          });
        }else {
          self.throwErr('shorthandSyntax', shorthand);
        }
      };

      /**
       * Pushes specified props from propery option to trans
       * @param  {arr || str} props -> The props to generate trans for.
       * @return {---}              -> Pushes to trans instance
       */
      const assignProps = function (props) {
        props = _.isString(props) ? [props] : props;
        for (let i = 0; i < props.length; i++) {
          //check to make sure prop non in global list
          //so that we don't create duplication
          if (!_.includes(globalPropList, props[i])) {
            globalPropList.push(props[i]);
            extractMgr.add('property', props[i]);
            //cycle through options
            for (let j = 0; j < 3; j++) {
              setPropOpt(extractMgr, [j, i]);
            }
          }
        }
      };

      /*
      If gate
       */
      //shorhand opt
      const shorthand = extractMgr.getOption('shorthand');
      if (!_.isEmpty(shorthand)) {
        convertShorthand(shorthand);
      }
      //property opt
      const props = extractMgr.getOption('property');
      if (!_.isEmpty(props)) {
        assignProps(props);
      }

      //>configOption
      return {
        extractMgr
      };
    };


    /**
     * Generates transition props for props whos transtion was not defined
     * @param  {map} extractMgr -> extractMgr instance
     * @return {map}       -> extractMgr instance
     */
    const genProp = function (extractMgr) {
      //if property opt specified do not autogen
      if (extractMgr.getOption('property') || extractMgr.getOption('autoGen') === false) {
        return {
          extractMgr
        };
      }

      //config omit
      const omitList = _.union(['__inheritProps__'], extractMgr.getOption('_trans') || []);
      const omitAll = _.includes(omitList, 'all');

      //@todo, regex?
      // const regexOmit = /(^media-)/i;

      //filter out objects
      const tnData = _.reduce(extractMgr.get('data'), function (prv, val, key) {
        if (!_.isPlainObject(val)) {
          prv[key] = val;
        }
        return prv;
      }, {});

      const curProps = extractMgr.get('property');
      //Find out the properties we need to gen for.
      //Only gen for properties that are not specified
      //if omitAll just return an empty array
      const propsToGen = !omitAll ? _.filter(_.keys(tnData), function (key) {
        return !_.includes(curProps, key)
               && !_.includes(omitList, key);
      }) : [];

      /**
       * Pushes specified props from propery option to tnRtn
       */
      for (let i = 0; i < propsToGen.length; i++) {
        const prop = propsToGen[i];
        //check to make sure prop non in global list
        //so that we don't create duplication
        if (!_.includes(globalPropList, prop)) {
          globalPropList.push(prop);
          extractMgr.add('property', prop);
          for (let j = 0; j < 3; j++) {
            setPropOpt(extractMgr, [j, i]);
          }
        }
      }

      //>genProp
      return {
        extractMgr
      };
    };


    //>extractor
    return teFlow.call({
      args: {
        extractMgr: _extractMgr
      }},
      configOption,
      genProp, {
        return: function (extractMgr) {
          //we need to return here so passes this val
          //and not an array val
          return extractMgr;
        }
      }
    );
  };

  /**
   * Cycles through the raw data which then is sent off to be extracted
   * with the hope that it will be return clean shaved and processable.
   * @param  {cls} transManager -> A soul of souls who handles all who pass
   *                               through its gates.
   * @return {list}             -> The res is pushed to the transList. The res
   *                               is made up of a target instance which was
   *                               generated on a indvual transition basis.
   *                               And the trans res as in the params that was
   *                               generated from the extraction.
   *                               {trans: obj, target: map}
   */
  let transList = Immutable.List();
  let target = transManager.next();

  while (target) {
    //gen a new extractManager, this manager is just made up of helper methods
    //to make our life a bit easer.
    const extractMgr = new TransExtractManager(target);
    //extranct and add
    const res = extractor(extractMgr);
    transList = transList.push(res);
    //next key
    target = transManager.next();
  }

  return {
    transList
  };
};


module.exports = transExtract;
