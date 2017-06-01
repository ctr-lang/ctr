const _           = require('lodash');
const teFlow      = require('te-flow');
const StateMgr    = require('./state-manager.js');
const _H          = require('../helpers/helper-index.js');



const stateConfig = function (_stateKey, _data, _target) {

  /**
   * Formats the data so we are always working with an object
   * to keep all things the same.
   * @param  {obj} data   -> raw data obj
   * @param  {map} target -> target instance
   * @return {---}        -> formated data obj
   */
  const formatData = function (stateKey, data, target) {

   //@hacky-ish fix for hyphened state key
    if (stateKey.match(/^state-/)) {
      stateKey = stateKey.replace('state-', '');
    }

    let globalData = {};
    ({data, globalData} = _H.util.getGlobal(data));

    const plural = _H.util.regularExp.pluralTest(stateKey, 'state');
    //plural container check, don't want to format if plural
    if (!plural) {
      data = _H.util.formatData(data, stateKey, {globalData});
    }

    //@hacky needed due to pr-#359 -> connect to helper-util.js
    if (!_.isEmpty(globalData)) {
      data[stateKey] = _H.util.merge(data[stateKey], {
        common: globalData
      });

      //if not plural there can be no "globalData" in the plural
      //global sense which is what this globalData is. As in there
      //is two common "globalData" one that is for plurals and one for locals.
      //But really this is just janky shit, and a work-around fix
      globalData = plural ? globalData : {};
    }

    return {
      stateKey,
      data,
      globalData,
      target
    };
  };


  const configMgr = function (stateKey, data, globalData, target) {
    //hacky but merging option of states object if there with global data
    globalData = data.states && data.states.option
                 ? _.defaultsDeep(globalData, data.states.option)
                 : globalData;

    //init stateMgr
    const stateMgr = new StateMgr(globalData);

    //cylce data and add to the stateMgr
    _.forEach(data, function (val, key) {
      if (_H.util.regularExp.pluralTest(stateKey, 'state')) {
        if (!_.includes(['common', 'global', 'option', 'states'], key)) {
          stateMgr.set(val, key, target);
        }
      }else {
        //single object
        stateMgr.set(val, stateKey, target);
      }
    });

    return {
      stateMgr
    };
  };


  return teFlow.call({
    args: {
      stateKey: _stateKey,
      data: _data,
      target: _target
    }},
    formatData,
    configMgr
  );
};

module.exports = stateConfig;

