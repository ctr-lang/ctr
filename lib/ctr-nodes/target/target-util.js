const _              = require('lodash');
const Immutable      = require('immutable');
const targetSelector = require('./target-selector.js');

/**
 * Will merge target data for two target instances
 * @param  {map} target       -> Target instance
 * @param  {map} mergeTarget  -> Target instance to be merged
 * @param  {obj} parentObjRef -> Refrance to parent obj
 * @return {map}              -> Merged target
 */
const targetUtil = {
  setStack: function (target, type, id, stackProcess = true) {
    if (!target.has('stack')) {
      target = target.set('stack', Immutable.List());
    }

    //add to list and return
    let index = target.get(type);
    index = index ? index.size : 0;
    return target.update('stack', function (list) {
      return list.push(Immutable.Map({
        type: type,
        index: index,
        id: id,
        process: stackProcess
      }));
    });
  },
  set: function (dataMap, target = false) {
    const self = this;
    target = target ? target : Immutable.Map();
    const type = dataMap.get('type');
    const id = dataMap.get('id');
    let stackProcess = dataMap.get('stackProcess');
    stackProcess = _.isBoolean(stackProcess) ? stackProcess : true;

    target = this.setStack(target, type, id, stackProcess);
    //check if key exists, if not initilize
    if (!target.has(type)) {
      target = target.set(type, Immutable.List());
    }

    //add to list and return
    target = target.update(type, function (list) {
      //update map
      dataMap = dataMap.withMutations(function (map) {
        //check for spe
        // let specificOption = map.get('specificOption');
        return map
               .set('process', stackProcess)
               .set('option', self.setOption(map.get('option'), map));
      });

      return list.push(dataMap);
    });


    return target;
  },
  update: function (target, data) {
    const type      = data.type;
    const id        = data.id;
    const val       = data.val;
    const key       = data.key;
    const merge     = data.merge || false;
    const overwrite = data.overwrite || false;

    if (_.isUndefined(val)) { return target; }

    return target.update(type, function (list) {
      //get index of id
      const [index] = list.findEntry(function (valMap) {
        return valMap.get('id') === id;
      });
      //update list with new val
      return list.update(index, function (valMap) {
        if (merge) {
          return _.cloneDeep(valMap.toJS(), val);
          // return util.merge(valMap.toJS(), val);
        }else if (!valMap.has(key) || overwrite) {
          valMap = valMap.set(key, val);
        }else {
          valMap = valMap.update(key, function (_val) {
            return _.cloneDeep(_val, val);
          });
        }
        return valMap;
      });
    });

  },
  //terminates we need to keep the reffrance
  terminator: function (data) {
    const self = this;
    const id               = data.id;
    const type             = data.type;
    let target             = data.target;
    const removedFromStack = _.isBoolean(data.removedFromStack)
                           ? data.removedFromStack
                           : false;

    //update process
    target = self.update(target, {
      id: id,
      val: false,
      type: type,
      key: 'process',
      overwrite: true
    });

    if (!removedFromStack) {
      return self.terminator({
        id: id,
        type: 'stack',
        target: target,
        removedFromStack: true
      });
    }

    return target;
  },


  setId: function (target) {
    const val = targetSelector.compose(target);
    let id = val.selectorCar;
    id += val.selector;
    id += val.selectorCdr;
    id += val.selectorMedia;

    //set id
    target = target.set('id', id);

    //update selectors
    _.forEach(_.keys(val), function (updateKey) {
      target = target.set(updateKey, val[updateKey]);
    });

    //@todo do I need?
    target = target.set('hash', target.hashCode());

    return target;
  },

  setOption: function (optionMap, dataMap) {
    //set default
    optionMap = optionMap ? optionMap : Immutable.Map();

    //@todo childrenInherit
    const targetList = ['applyTo', 'attachTo', 'appendTo', 'root',  'override',
                      'inherit', 'inheritOpt', 'inheritProp', 'appendKey'];

    const updateOpt = function (map, key, optVal, optKey, addOn) {
      return map.update(key, function (optMap) {
        if (!optMap.has(optKey)) {
          optMap = optMap.set(optKey, optVal);
        }else if (addOn) {
          optMap = optMap.set(optKey, optMap.update(optVal, function (_val) {
            _val += optVal;
            return _val;
          }));
        }
        return optMap;
      });
    };

    return optionMap.reduce(function (map, optVal, optKey) {

      //add in any raw options, will not be prefixed
      if (optKey.charAt(0) !== '_' && optKey !== 'andQuery' && optKey !== 'orQuery') {
        map = map.setIn(['raw', optKey], optVal);
      }

      if (_.includes(targetList, optKey)) {
        //target
        return updateOpt(map, 'target', optVal, optKey, dataMap.get('addOn'));
      }
      //specific
      return updateOpt(map, 'specific', optVal, optKey);
    }, Immutable.Map({
      //@pr-193
      target: Immutable.Map(),
      //@todo maybe change name to internal, and have raw be specific
      specific: Immutable.Map(),
      //any non-internal options
      raw: Immutable.Map()
    }));
  }
};

module.exports = targetUtil;


