const _           = require('lodash');
const teFlow      = require('te-flow');
const AnimManager = require('./anim-manager.js');
const _H          = require('./../helpers/helper-index.js');

const animConfig = function (_key, _data) {

  /**
   * Preps the data to be processed
   * @param  {str} key  -> anim key
   * @param  {obj} data -> anim data
   * @return {---}      -> {key, data, globalData}
   */
  const formatData = function (key, data) {
    let globalData;
    ({data, globalData} = _H.util.getGlobal(data));

    //plural container check, don't want to format if plural
    if (!_H.util.regularExp.pluralTest(key, 'animation')) {
      data = _H.util.formatData(data, key, {
        addOnKeys: ['timeline', 'tl'],
        globalData
      });
    }

    return {
      key,
      data,
      globalData
    };
  };

  /**
   * Inits the manager and then sets the data from the raw data obj
   * to create a itteration to cycle over in extract
   * @return {---} -> {animMgr} animation class with configed data
   */
  const initSetData = function (key, data, globalData) {
    //init the manager to set data to
    const animMgr = new AnimManager(key, globalData);

    //loop through data and the objs
    _.forEach(data, function (val, objKey) {
      animMgr.set(val, objKey);
    });
    return {
      animMgr
    };
  };

  //-> passing data to anim-extract
  return teFlow.call({
    args: {
      key: _key,
      data: _data
    }},
    formatData,
    initSetData
  );
};

module.exports = animConfig;

