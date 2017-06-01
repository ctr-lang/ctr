const _            = require('lodash');
const teFlow       = require('te-flow');
const MediaManager = require('./media-manager.js');
const _M           = require('../manager/manager-index.js');
const _H           = require('../helpers/helper-index.js');

/**
 * #mediaConfig
 * Basically all this bugger does is to find out if we are working with
 * an media obj made up of objs or a single set and configs the key if needed.
 * @param  {obj} data   -> The raw media obj
 * @param  {map} target -> Target instance
 * @return {obj}        -> {mediaMgr, target}
 */
const mediaConfig = function (_data, _target, _rawKey) {

  /**
   * format data to make it all the same
   * @param  {obj} data   -> data obj of media
   * @param  {map} target -> target instance
   */
  const formatData = function (data, target, rawKey) {
    let globalData;
    //@todo this whould be handled within the manager
    //precheck for internal option object leftover from state
    if (data.option) {
      //remove if so
      data = _.size(data.option) === 1 && _.isBoolean(data.option._nonGen)
             ? _.omit(data, 'option')
             : data;
    }

    //get global data
    ({data, globalData} = _H.util.getGlobal(data));

    //plural container check, don't want to format if plural
    if (!_H.util.regularExp.pluralTest(rawKey, 'media')) {
      data = _H.util.formatData(data, 'media', {
        addOnKeys: ['mixin', 'query'],
        globalData
      });
    }

    return {
      data,
      target,
      globalData,
      rawKey
    };
  };

  /**
   * Inits the class manager which we set the data to for processing
   */
  const initMgr = function (data, target, globalData, rawKey) {
    //create manager
    const mediaMgr = new MediaManager(globalData);
    return {
      data,
      target,
      mediaMgr,
      rawKey
    };
  };


  /**
   * Configs the data, in particualre it configs any shorthand keys
   * that we need to take care of before setting it in the class manager
   */
  const configData = function (data, target, mediaMgr, rawKey) {
    const mediaQBreakPoints = _M._option.getIn(['media']);
    //Check for media key notation
    if (_.isString(rawKey)) {
      //helper
      const createModObj = function (modifier) {
        return _.reduce(data.media, function (prv, val, key) {
          prv[modifier][key] = val;
          return prv;
        }, {[modifier]: {}});
      };

      if (rawKey.match(/^media\-\+/)) {
        //above
        data = createModObj('+' + rawKey.replace(/^media\-\+/, ''));
      }else if (rawKey.match(/^media\-\-/)) {
        //less
        data = createModObj('-' + rawKey.replace(/^media\-\-/, ''));
      }else if (rawKey.match(/^media\-\|/)) {
        //between
        data = createModObj(rawKey.replace(/^media\-\|/, ''));
      }else if (rawKey.match(/^media\-/)) {
        //at
        data = createModObj(rawKey.replace(/^media\-/, ''));
      }
    }
    //css regex validation for raw value
    const css = new RegExp(/^(auto|0)$|^[+-]?[0-9]+.?([0-9]+)?(px|em|ex|%|in|cm|mm|pt|pc)$/);
    //builds the mixin keys
    data = _.reduce(data, function (prv, val, key) {
      //default non-obj notation
      if (key !== 'media') {
        if (mediaQBreakPoints[key]) {
          //check to see if userer is using key shorthand and set if so
          val = _.defaultsDeep(val, {query: {mixin: {at: key}}});
        }else if (key.charAt(0) === '+') {
          //above shortand
          const above = key.slice(1);
          if (mediaQBreakPoints[above]) {
            val = _.defaultsDeep(val, {query: {mixin: {above: above}}});
          }else if (css.test(above)) {
            //raw value
            val = _.defaultsDeep(val, {query: {mixin: {above: above}}});
          }
        }else if (key.charAt(0) === '-') {
          //below shortand
          const below = key.slice(1);
          if (mediaQBreakPoints[below]) {
            val = _.defaultsDeep(val, {query: {mixin: {below: below}}});
          }else if (css.test(below)) {
            //raw value
            val = _.defaultsDeep(val, {query: {mixin: {below: below}}});
          }
        }else if (key.indexOf('-')) {
          //between shorthand
          const min = key.slice(0, key.indexOf('-'));
          const max =  key.slice(key.indexOf('-') + 1);
          if (mediaQBreakPoints[min] && mediaQBreakPoints[max]) {
            //merge in key, will be overrid is already set
            val = _.defaultsDeep(val, {query: {mixin: {
              between: [min, max]
            }}});
          }else if (css.test(min) && css.test(max)) {
            //raw value
            val = _.defaultsDeep(val, {query: {mixin: {
              between: [min, max]
            }}});
          }
        }
      }

      //set
      prv[key] = val;
      return prv;
    }, {});

    return {
      data,
      target,
      mediaMgr
    };
  };


  /**
   * Sets the data in the class manager
   */
  const setData = function (data, target, mediaMgr) {
    _.forEach(data, function (val, key) {
      mediaMgr.set(val, key, target);
    });
    return {
      mediaMgr
    };
  };


  return teFlow.call({
    args: {
      data: _data,
      target: _target,
      rawKey: _rawKey
    }},
    formatData,
    initMgr,
    configData,
    setData
  );

};

module.exports = mediaConfig;
