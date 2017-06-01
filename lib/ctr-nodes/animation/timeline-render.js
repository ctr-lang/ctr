const styl    = require('stylus');
const _       = require('lodash');
const teFlow  = require('te-flow');
const convert = require('./../convert/convert-index.js');
const _M      = require('./../manager/manager-index.js');
const _H      = require('../helpers/helper-index.js');
const Nodes   = styl.nodes;

const animTimeline = function (_tlName, _timeline, target) {

  //@docs
  const configTimeline = function (tlName, timeline) {

    //check to make sure its a timeline we can config
    if (!_.isObject(timeline)) {
      //if not obj kill teFlow
      return {_kill: true};
    }
    //check to make sure name is not in timeline this can happen
    //with multiple option
    if (timeline.name) {
      timeline = _.omit(timeline, 'name');
    }
    //format timeline keys if needed
    const digRegex = /^\d/;
    const perRegex = /%$/;

    timeline = _.reduce(timeline, function (prv, val, key) {
      if (digRegex.test(key)) {
        //make sure we have %
        if (!perRegex.test(key)) { key += '%'; }
      }
      //process any helpers, hacky but best can do right now
      val = _H.util.processHelper(val, target);
      prv[key] = val;
      return prv;
    }, {});

    return {
      tlName,
      timeline
    };
  };

  /**
   * Converts the js data on over to stylus data
   * @param  {str} tlName   -> Timeline name
   * @param  {obj} timeline -> Timeline data object
   * @return {styl}         -> Stylus data to be used in stylus fn call
   */
  const convertToStylus = function (tlName, timeline) {
    const params = new Nodes.Arguments();
    params.push(new Nodes.Literal(tlName));
    params.push(convert.toStylus(timeline, {
      timeline: true
    }));
    return {
      params,
      tlName,
      timeline
    };
  };

  /**
   * Alright buckle-up cus this is the reason I drink. To make a long
   * story short if your not fimilair with stylus code base its one
   * fucking mind-melt. Nevertheless, theres the `Evaluator` and hes
   * one tricky devil and the trick for this whole thing to work is
   * he must return something to us so we can push it into the `block`.
   * Alas, `Evaluator.visitKeyframes` throws us for bit of a loop
   * cus rather then returning a val it cycles the vendors to add prefixes
   * and pushed that to the `block` ref but thats not our `block` ref.
   * So basically what we have to do here is bind a our very own custom
   * `visitKeyframs` so we get a return. Sylus says they will remove vendor
   * pre-fixin at version `1.0` but between you and me I doubt that
   * make it that far and thats on "official" record pun intended stylus code.
   * But seriously someone should rewrite stylus's code base the concept
   * is fucking dope as the pope.
   * @param  {sty} params -> The stylus params we be passing along
   * @return {---}        -> None pushed to block
   */
  const createTimeline = function (params, tlName, timeline) {
    const visitKeyframes = function (keyframes) {
      if (keyframes.fabricated) { return keyframes; }

      keyframes.val = this.interpolate(keyframes).trim();
      const val = this.lookup(keyframes.val);
      if (val) {
        keyframes.val = val.first.string || val.first.name;
      }
      keyframes.block = this.visit(keyframes.block);
      return keyframes;
    };
    //call stylus funciton and push to block
    const visitCall = function (fn) {
      _M._stylus.visitKeyframes = _.bind(visitKeyframes, _M._stylus, _);
      let call = new Nodes.Call(fn, params);
      _M._stylus.return++;
      call = _M._stylus.visit(call);
      _M._stylus.return--;
      return call;
    };

    _M._block.push(visitCall('CTR_CreateTimeline'));

    return {
      tlName,
      timeline
    };
  };


  return teFlow.call({
    args: {
      tlName: _tlName,
      timeline: _timeline
    }},
    configTimeline,
    convertToStylus,
    createTimeline, {
      return: function (tlName, timeline) {
        return {
          tlName,
          timeline
        };
      }
    }
  );
};

module.exports = animTimeline;
