const teFlow    = require('te-flow');
const Immutable = require('immutable');
const animation = require('./../animation/anim-index.js');
const _T        = require('./../target/target-index.js');
const _M        = require('../manager/manager-index.js');

const processAnim = function (_key, _data, _target) {

  const getAnimSet = function (key, data, target) {
    const animList = animation(key, data);
    return {
      animList,
      target
    };
  };

  const cycleResSet = function (animList, target) {
    //cycle results
    animList.forEach(function (animRes) {
      const animTarget = animRes.target;
      //copy target
      const targetCopy = target;

      let mergedTarget = Immutable.Map();
      //merge original target with
      mergedTarget = mergedTarget.withMutations(function (map) {
        return map
               .set('data', animRes.data)
               .set('target', _T.merge(targetCopy, animTarget));
      });


      //throw back into extractor to have the values prcessed
      _M._queue.add(mergedTarget);
    });
  };


  teFlow.call({
    args: {
      key: _key,
      data: _data,
      target: _target
    }},
    getAnimSet,
    cycleResSet
  );
};

module.exports = processAnim;
