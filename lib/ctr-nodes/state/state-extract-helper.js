const Immutable = require('immutable');
const _M        = require('../manager/manager-index.js');
const _T        = require('./../target/target-index.js');


const stateCompose = {
/**
 * Sets and configs the data and the target, creates the selector
 * key and merges target opts basically
 * @param {obj}  transProps   -> Transition props
 * @param {map}  mergedTarget -> The target from the trans output
 * @param {map}  res          -> The trans map result
 * @return {obj}              -> transProps/mergedTarget will all the right
 *                               data and options so we can throw it back
 *                               into the queue to be processed
 */
  setState: function (data, state) {
    const self = this;

    //options
    const option      = state.getIn(['option', 'specific']);
    const stateType   = option.get('_stateType');
    const globalTrans = option.get('global') || false;

    //default for static is by itself
    let trans = data.get('trans');

    //static
    const staticData = data.get('static');
    //merge in static data
    if (staticData && staticData.size) {
      trans = trans.mergeDeep(data.get('static'));
    }

    //object
    const objData = data.get('object');
    //merge in object data
    if (objData && objData.size) {
      trans = trans.mergeDeep(data.get('object'));
    }

    //state, dependant on nonGen, which is only done,
    //when there is no `on` or `non` object defined within a state
    if (!option.get('_nonGen')) {
      //default
      state = state.mergeDeepIn(['data'], trans);
    }else {
      state = state.set('data', trans);
    }

    //non, global level, sorta a werid option, but I like
    //its an OG option, and we gotz to keep the OGs around
    if (stateType === 'non' && globalTrans) {
      //get trans data
      const globalData = state.get('data');

      //remove data from state, and stack
      state = state.set('target', _T.util.terminator({
        id: state.get('id'),
        type: 'state',
        target: state.get('target')
      }));
      state = state.set('data', Immutable.Map());

      //root and boot baby
      if (globalTrans === 'root') {
        //add data to queue, the reason we target false cus
        //we want to apply this data on the global root levvel
        _M._queue.add(Immutable.Map({
          data: globalData,
          target: false
        }));

        //Imporatant that we return false here so we dont
        //queue in state-extract
        return false;
      }else if (globalTrans) {
        //find the global level
        state = _T.util.setId(state.get('target'));

        //get index of global
        const globalIndex = state.get('stack').findLastIndex(function (val) {
          return val.get('type') === 'component';
        });

        //means no componant to attach to, so we default to index
        if (globalIndex === -1) {
          //queue it on up
          _M._queue.add(Immutable.Map({
            data: globalData,
            target: false
          }));
        }else {
          //get specific reffranc if component
          let globalComp = state.getIn(['stack', globalIndex]);
          globalComp = state.get(globalComp.get('type')).last();

          //get option
          let compOption = globalComp.getIn(['option', 'specific']);

          //get them options assigned
          compOption = {
            key: compOption.get('_key'),
            selector: compOption.get('_selector')
          };

          //create da construct of the struc
          let compConst = Immutable.fromJS({
            'component-__custom__': globalData
          });

          //add in options
          compConst = compConst.setIn(['component-__custom__', 'option'],
            Immutable.fromJS(compOption)
          );

          //queue it on up
          _M._queue.add(Immutable.Map({
            data: compConst,
            target: false
          }));
        }

        //Imporatant that we return false here so we dont
        //queue in state-extract
        return false;
      }
    }else if (stateType === 'non') {

      //if its a nonGen we have to update the data
      if (option.get('_nonGen')) {
        //add to level data
        state = state.update('data', function (map) {
          return map.setIn(['option', '_nonGen'], true);
        });

        //inject non into objs
        state = self.injectNonGen(state);
      }

      //update the key to be a non key
      state = state.updateIn(['target', 'state'], function (stack) {
        return stack.update(stack.size - 1, function (stackState) {
          return stackState.update('key', function (key) {
            //@todo double error check
            return ':not(' + key + ')';
          });
        });
      });
    }

    return state;
  },

  /**
   * Updates data, option with `_nonGen: true`, used for latter refs
   * accross the baord.
   * @param  {map} state -> map ref
   * @return {map}       -> updated map
   */
  injectNonGen: function (state) {
    /**
     * A recusice funk that will add `_nonGen: true` option to all sub-objs
     * @param  {map} map   -> data map ref
     * @return {map}       -> with update options
     */
    const findAndInject = function (map) {
      let levelInject = false;
      //reduce and reuse to find and inject
      return map.reduce(function (_map, val, key) {
        //find if has option, if not inject
        if (levelInject === false && !_map.hasIn(['option', '_nonGen'])) {
          //set level to true so to we don't was lookups
          levelInject = true;
          //inject option
          if (_map.has('option')) {
            //merge
            _map = _map.setIn(['option', '_nonGen'], true);
          }else {
            //set
            _map = _map.set('option', Immutable.Map({
              _nonGen: true
            }));
          }
        }

        //find map level to inject in
        if (key !== 'option' && Immutable.Map.isMap(val)) {
          //recusive magic
          _map = _map.update(key, function (__map) {
            return findAndInject(__map);
          });
        }
        return _map;
      }, map);
    };

    //Inject/update data to be returned
    return state.update('data', function (map) {
      return findAndInject(map);
    });
  }
};


module.exports = stateCompose;
