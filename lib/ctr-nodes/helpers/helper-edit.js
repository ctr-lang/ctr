const Immutable  = require('immutable');
const _M         = require('../manager/manager-index.js');
const targetUtil = require('../target/target-util.js');

/**
 * This guy handles any edit argumetns. What it does is it
 * just removes edit, and configs a new target and adds that
 * to the quene.
 * @param  {map} staticMap -> map args from index
 * @param  {map} target    -> target instance
 * @return {map}           -> cleaned of edit
 */
const edit = function (staticMap, target) {
  //get/remove edit
  const _edit = staticMap.get('edit');
  staticMap = staticMap.delete('edit');

  //set new data to be added to the queue
  const data = _edit !== true
             ? {background: _edit}
             : {background: _M._option.getIn(['global', 'editColor'])};

  const editId = 'edit-' + Math.random().toString(36).substr(2, 9);

  let dataMap = Immutable.fromJS({
    //extra space is important here, so keep it.
    key: ' *',
    data: data,
    addOn: true,
    type: 'edit',
    id: editId
  });

  //set target
  dataMap = dataMap.set('target',
    targetUtil.set(dataMap, target)
  );

  //add to queue
  _M._queue.add(dataMap);

  //return statMap without edit
  return staticMap;
};

module.exports = edit;
