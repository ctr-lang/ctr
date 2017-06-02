const _         = require('lodash');
const Immutable = require('immutable');
const _M        = require('../manager/manager-index.js');


const clearfix = function (staticMap, target, mergeData = false) {
  //get/remove
  const _clearfix = staticMap.get('clearfix');
  staticMap = staticMap.delete('clearfix');
  if (_clearfix === true) {
    //config after and add to new quene
    let data = {
      after: {
        content: '',
        display: 'table',
        clear: 'both'
      }
    };

    //only time it will be merging is from grid shit
    if (mergeData) {
      data = _.merge(data, staticMap.toJS());
    }

    //set map
    const dataMap = Immutable.fromJS(data);

    //add to queueu
    _M._queue.add(Immutable.Map({
      data: dataMap,
      target: target
    }), {
      // processNow: true
    });
  }
  //return map without clearfix
  return staticMap;
};

module.exports = clearfix;
