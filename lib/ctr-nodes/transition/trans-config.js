const _                 = require('lodash');
const teFlow            = require('te-flow');
const TransitionManager = require('./trans-manager.js');
const _H                = require('../helpers/helper-index.js');

/**
 * Fomats the data to be proccessed and then sets that data
 * into the manager to then be extracted
 * @param  {obj} _data -> raw data object
 * @return {cls}       -> the transitionManager (transMgr) which
 *                        has all our data set within via a list
 */
const transConfig = function (_transKey, _data, _target, _option) {

  /**
   * Formats the data obj so we be working with like data struc
   * regardless of if the user is using obj notation or a single
   * instance of the trans
   * @param  {obj} data -> trans data obj
   * @return {---}      -> data: the formated trans obj struc
   *                       globalData: global data obj if present
   */
  const formatData = function (transKey, data, target, option) {
    let globalData;
    //if there is a global data obj, pull it from the main
    //data and returns it as such
    ({data, globalData} = _H.util.getGlobal(data));

    let processedHelper = false;

    //format data
    // data = _H.util.formatData(data, 'transtion', {globalData});
    //plural container check, don't want to format if plural
    if (!_H.util.regularExp.pluralTest(transKey, 'transition')) {
      //process helpers if any
      data = _H.util.processHelper(data, target);
      processedHelper = true;
      //foramted
      data = _H.util.formatData(data, transKey, {globalData});
    }

    return {
      data,
      globalData,
      target,
      option,
      processedHelper
    };
  };

  /**
   * Create new TransitionManager which will config the the trans
   * obj to be processed and generated
   * @param  {obj} data       -> trans data obj, without global
   * @param  {obj} globalData -> global data of empty obj
   * @return {---}            -> data: data obj
   *                             transMgr: manager reffer to trans-manager.js
   */
  const initMgr = function (data, globalData, target, option, processedHelper) {
    const transMgr = new TransitionManager(globalData, option);
    return {
      data,
      transMgr,
      target,
      processedHelper
    };
  };

  /**
   * Set the data into the trans manager
   * @param  {obj} data     -> trans data obj
   * @param  {cls} transMgr -> manager
   * @return {cls}          -> Passes along the transMgr which is now
   *                           populated\
   */
  const setData = function (data, transMgr, target, processedHelper) {
    //cycle through raw object and have each indv ogj
    //be processed, configed, and stored by the transManger
    _.forEach(data, function (val, key) {
      val = processedHelper ? val : _H.util.processHelper(val, target);
      transMgr.set(val, key);
    });

    //-> main return for `transConfig`
    return {
      transMgr
    };
  };


  return teFlow.call({
    args: {
      transKey: _transKey,
      data: _data,
      target: _target,
      option: _option
    }},
    //-> call order
    formatData,
    initMgr,
    setData
  );
};

module.exports = transConfig;

