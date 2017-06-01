const _         = require('lodash');
const teFlow    = require('te-flow');
const Immutable = require('immutable');
const defclass  = require('defclass');
const throwErr  = require('./anim-errors.js');
const getPreset = require('../preset/preset-index.js');
const _T        = require('../target/target-index.js');
const _M        = require('../manager/manager-index.js');
const _H        = require('../helpers/helper-index.js');

const AnimManager = defclass({
  constructor: function (key, globalData) {
    const self = this;
    self.key = key;

    //set statck to push to
    self.stack = Immutable.List();
    //set default map
    self.defaultData  = globalData;
    // self.defaultOption = _H.util.merge(globalData.option, defaultOption);
    //grab/set the defauts
    self.defaultOption = _M._option.getIn(['animation']);
  },

  //get preset
  configPreset: function (data) {
    //Prefixes key with %
    const prefix = function (tl) {
      //format timeline keys if needed
      const digRegex = /^\d/;
      const perRegex = /%$/;
      return _.reduce(tl, function (prv, val, key) {
        if (digRegex.test(key)) {
          //make sure we have %
          if (!perRegex.test(key)) { key += '%'; }
        }
        prv[key] = val;
        return prv;
      }, {});
    };

    //conerts tl notation to use timeline notation
    const convertTl = function (_data) {
      if (!_.isEmpty(_data.timeline)) {
        return _data;
      }else if(!_.isEmpty(_data.tl)) {
        _data.timeline = _.cloneDeep(_data.tl);
        return _.omit(_data, ['tl']);
      }
      return _data;
    };

    //merges in tl with timeline if present to pick it up
    const mergeTl = function (_data, _preset) {
      const dataTl = prefix(convertTl(_data).timeline);
      const presetTl = _preset.timeline;
      //deep mergein
      const tl = _.defaultsDeep(_.cloneDeep(dataTl), _.cloneDeep(presetTl));
      //assing
      _data.timeline = tl;

      return {
        data: _.omit(_data, ['tl']),
        preset: _preset
      };
    };

    const hasTl = function (val) {
      return !_.isEmpty(val.tl) || !_.isEmpty(val.timeline)
    };

    if (data.preset) {
      //assing preset
      let preset = data.preset;
      //remove
      data = _.omit(data, 'preset');
      //get preset
      preset = getPreset('animation', preset);
      //merge preset
      if (preset) {
        //check to see if we need to merege the tl's
        if (hasTl(data)) {
          ({data, preset} = mergeTl(data, preset));
        }
        return _H.util.merge(data, preset);
      }
    }else if (data.option && data.option.preset) {
      //assing preset
      let preset = data.option.preset;
      //remove
      data.option = _.omit(data.option, 'preset');
      //get preset
      preset = getPreset('animation', preset);
      //merge preset
      if (preset) {
        //check to see if we need to merege the tl's
        if (hasTl(data)) {
          ({data, preset} = mergeTl(data, preset));
        }
        return _H.util.merge(data, preset);
      }
    }

    return data;
  },

  //basic check to make sure we have all the right junk
  configTimeline: function (data, key) {

    let tlName;
    ({keyVal: tlName, data} = _H.findKey(data, ['name', 'tlName'], {
      addToOption: true,
      optionKey: 'name'
    }));

    //No timeline found, check hyphnated key
    if (!tlName && key.match(/(^anim-|^animation-)/gi)) {
      tlName = key.match(/-(.*)/)[1];
      //set name in the option
      data.option = data.option || {};
      data.option.name = data.option.name || tlName;
    }
    //If no timeline if found initaly, then we look deeper
    if (!tlName) {
      //tl name ===  to timline if not an obj
      if (_.isString(data.timeline)) {
        //string tl
        tlName = data.timeline;
      }else if ((key === 'animation' || key === 'anim') && data.option && data.option.shorthand) {
        //if no name is fond yet try to default to shorthand key
        //kind silly but hell, its almost christmas.
        const tempKey = _.keys(data.option.shorthand);
        if (tempKey.length >= 1) {
          tlName = tempKey[0];
        }
      }else {
        tlName = key;
      }

      //auto gen-hash-anim name if still anim
      //@todo -> future, set this as a option, mabye prefix it
      if (tlName === 'animation' || tlName === 'anim') {
        tlName = 'animation_' +  Math.random().toString(36).substr(2, 9);
      }

      //add to option obj
      data.option = data.option || {};
      data.option.name = tlName;
    }


    //formate check
    if (tlName) {
      if (_.isString(tlName)) {
        return {
          data,
          tlName
        };
      }

      //syntax error
      throwErr('syntax', {
        expected: 'String',
        received: typeof data.name
      });
    }

    //noName error
    throwErr('noName', data);
  },

  configOption: function (option, key) {
    const self = this;

    //we set a ref to the default options here, which we then
    //can look up if needed.
    option.default = self.defaultOption;

    //check for key specific option
    if (option[key]) {
      option = _H.util.merge(option[key], option);
    }

    return option;
  },


  set: function (_data, _key = false) {
    const self = this;

    //fomat data
    const format = function  (data, key) {

      const checkOptions = ['delay', 'duration', 'mode', 'direction', 'count', 'state', 'ease', 'shorthand', 'animationShorthand'];
      //check for options, add to option obj
      _.forEach(checkOptions, function (val) {
        ({data} = _H.findKey(data, [val], {
          addToOption: true,
          optionKey: val,
          depth: 1
        }));
      });

      //check for preset and config if so
      data = self.configPreset(data);

      //multiple option check
      let multiple;
      ({data, keyVal: multiple} = _H.findKey(data, ['multiple'], {
        optionKey: 'multiple'
      }));

      if (multiple) {

        //if multile, extract and kill current funk
        let timeline;
        ({data, keyVal: timeline} = _H.findKey(data, ['timeline', 'tl']));
        //multiple, cycle
        _.forEach(timeline, function (val, tlKey) {
          //merge in data
          const multiData = _H.util.merge({timeline: val}, data);
          //check shortand, only what to send its data if so
          if (multiData.option && multiData.option.shorthand) {
            const {tlName} = self.configTimeline(multiData, tlKey);
            //get shorthand
            const shorthand = multiData.option.shorthand[tlName];
            //assing its data ref
            if (shorthand) {
              multiData.option.shorthand = {[tlName]: shorthand};
            }
          }

          //throw back into the mix
          self.set(multiData, tlKey);
        });

        //kill now that this data has been thrown back into the mix
        //to be processed indv
        return {
          _kill: true
        };
      }

      return {
        data,
        key
      };
    };

    /**
     * Configs the data
     */
    const config = function  (data, key) {
      //config/merge global data if present
      data = _.isEmpty(self.defaultData)
          ? data
          : _H.util.mergeGlobal({val: data, key: key, globalData: self.defaultData});

      //get the timeleine name and key
      let tlName;
      ({data, tlName} = self.configTimeline(data, key));

      //check for __hash__ keyword -> is so hash-it
      if (tlName.match(/__hash__/gi)) {
        //check if its a hash test
        if (data.option && data.option.hashTest) {
          tlName = tlName.replace(/__hash__/gi, '_hashit_');
        }else {
          tlName = tlName.replace(/__hash__/gi, Math.random().toString(36).substr(2, 9));
        }
        //update name reff in date
        data.option.name = tlName;
      }


      //kill if no timeline neme found
      if (!tlName) {
        return {
          _kill: true
        };
      }

      let timeline;
      ({data, keyVal: timeline} = _H.findKey(data, ['timeline', 'tl']));
      //send of timeline to be processed
      if (_.isObject(timeline)) {
        // We add the timeline to queue due to how we have to build
        // the timeline block
        _M._queue.addTimeline({
          tlName: tlName,
          timeline: timeline
        });
      }

      //seperate option from data
      let option;
      ({data, option} = _H.util.getOption(data));

      //config option
      option = self.configOption(option, tlName);

      return {
        data,
        option
      };

    };

    const setStack = function  (data, option) {
      const animId = _H.util._id.gen('animation');
      let dataMap = Immutable.fromJS({
        key: '',
        data: data,
        option: option,
        type: 'animation',
        id: animId
      });

      //set wrap
      dataMap = _T.wrap.setStack(dataMap);

      //add to stack
      self.stack = self.stack.push(dataMap.get('target'));

    };

    teFlow.call({
      args: {
        data: _data,
        key: _key
      }},
      format,
      config,
      setStack
    );
  },
  next: function () {
    const self = this;
    //nothing left
    if (!self.stack.size) { return false; }
    //get target in line
    const target = self.stack.first();
    //remove from stack
    self.stack = self.stack.shift();

    return target;
  }
});

module.exports = AnimManager;
