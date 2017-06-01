const _         = require('lodash');
const animation = require('./animation/preset-animation-index.js');
const state     = require('./state/preset-state-index.js');
const filter    = require('./filter/preset-filter-index.js');
const filterMod = require('./filter/preset-modifier.js');
const _H        = require('../helpers/helper-index.js');
const fuzzy     = require('./../../util/fuzzy-error.js');

const getPreset = function (type = 'all', presetKey, {stateType, modifiers} = {}) {
  let preset = null;
  if (type === 'animation') {
    //loopp to find preset match
    _.forEach(animation, function (collection) {
      if (collection[presetKey]) {
        preset = collection[presetKey];
        //bust loop
        return false;
      }
    });
  }else if (type === 'state') {
    _.forEach(state, function (collection) {
      if (collection[presetKey]) {
        //we have to do a bit of configuration with state due to the statetype
        preset = _.reduce(collection[presetKey], function (prv, val, key) {
          if (key === 'static') {
            prv[key] = val;
          }else if (key === stateType) {
            //want to inject these properties into root of object
            prv = _.reduce(val, function (_prv, _val, _key) {
              if (!_prv[_key]) {
                //set
                _prv[_key] = _val;
              }
              return _prv;
            }, prv);
          }

          return prv;
        }, {});
        //bust loop
        return false;
      }
    });
  }else if (type === 'filter') {
    //loopp to find preset match
    _.forEach(filter, function (collection) {
      if (collection[presetKey]) {
        preset = collection[presetKey];
        //handle modifiers
        if (!_.isEmpty(modifiers.filter) || !_.isEmpty(modifiers.element)) {
          preset = filterMod(preset, modifiers);
        }
        //bust loop
        return false;
      }
    });
  }

  //If no preset is found throw an error
  if (!preset) {
    /**
     * Helper to get preset keys to fuzz against
     * @return {arr} -> keys to fuzzy
     */
    const getKeysToFuzzy = function () {
      let keys = [];
      //wrapper to push keys
      const pushKeys = function (colType) {
        _.forEach(colType, function (col) {
          keys = _.union(keys, _.keys(col));
        });
      };
      if (type === 'animation') {
        pushKeys(animation);
      }else if (type === 'state') {
        pushKeys(state);
      } else if (type === 'filter') {
        pushKeys(filter);
      } else {
        //all
        pushKeys(state, animation);
      }
      return keys;
    };

    //throw error
    _H.throwErr({
      type: 'Preset Not Found',
      msg: [
        'I could not find your preset:' + presetKey + '. Maybe you are trying to',
        'use a preset that does not exist or you misspelled it. I misspell it all the time.',
        'Like a good neighbor, let me fuzzy check it for you against all presets.\n',
        fuzzy(presetKey, getKeysToFuzzy())
      ].join(' ')
    });

    return false;
  }

  return preset;
};

module.exports = getPreset;
