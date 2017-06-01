const _            = require('lodash');
const teFlow       = require('te-flow');
const Immutable    = require('immutable');
const util         = require('../target/target-util.js');


const targetWrap = {
  findType: function (target, type, stateParent = false) {
    const stack = target.get('stack');
    //no stack
    if (!stack || !stack.size) {
      return false;
    }

    const typeData = stack.findLast(function (map, index, list) {
      const typeFound = map.get('type') === type;
      //type such as `state`
      if (typeFound) {
        //trans when gened in a state is set to default
        //so we have to take this in account
        if (stateParent) {
          return list.get(index - 1).get('process');
        }

        return map.get('process');
      }
    });

    if (typeData) {
      const id = typeData.get('id');
      //get corresponing type val from type stack
      return target.get(type).find(function (map) {
        if (map.get('id') === id) {
          return true;
        }
      });
    }

    return false;
  },
  inherit: function (data) {
    const inherit = {
      option: true,
      prop: false
    };

    //type default
    if (data.get('type') === 'media') {
      inherit.prop = true;
    }

    const has = function (key) {
      for (let i = 0; i < key.length; i++) {
        const res = data.hasIn(['option', 'raw', key[i]]);
        if (res) {
          return res;
        }
      }
      return false;
    };

    const get = function (key) {
      for (let i = 0; i < key.length; i++) {
        const res = data.getIn(['option', 'raw', key[i]]);
        if (!_.isUndefined(res)) {
          return res;
        }
      }
    };

    if (has(['inherit'])) {
      if (get(['inherit'])) {
        inherit.option = true;
        inherit.prop = true;
        return inherit;
      }
      inherit.option = false;
      inherit.prop = false;
      return inherit;
    }

    if (has(['inheritProps', 'inheritProperty'])) {
      if (get(['inheritProps', 'inheritProperty'])) {
        inherit.prop = true;
      }else {
        inherit.prop = false;
      }
    }

    if (has(['inheritOpts', 'inheritOption'])) {
      if (get(['inheritOpts', 'inheritOption'])) {
        inherit.option = true;
      }else {
        inherit.option = false;
      }
    }

    return inherit;
  },



  genTrans: function (data, parent, inherit) {
    const inheritOption = inherit.option;
    const inheritProp   = inherit.prop;

    if (inheritOption === false || inheritProp === false) {
      return true;
    }

    const parentData = parent.get('data');
    const parentOption = parent.getIn(['option', 'raw']);

    //check options, if diff we need to gen trans
    let optionEqual = !data.getIn(['option', 'raw']).size;
    if (!optionEqual) {
      optionEqual = parentOption.equals(data.getIn(['option', 'raw']));
      return true;
    }

    //make sure same props otherwise we need to gen trans
    const dataKeyEqual = data.get('data').every(function (val, key) {
      return parentData.has(key);
    });

    return !dataKeyEqual;
  },

  wrap: function (_dataMap, option) {
    const self = this;

    const configWrap = function (dataMap) {
      const target = dataMap.get('target');
      let transWrap;
      //check state first
      const stateWrap = self.findType(target, 'state');
      if (stateWrap) {
        transWrap = self.findType(target, 'transition', true);
        return {
          dataMap,
          wrap: {
            state: stateWrap,
            trans: transWrap
          }
        };
      }

      if (!stateWrap) {
        //check trans
        transWrap = self.findType(target, 'transition');
        if (transWrap) {
          return {
            dataMap,
            wrap: {
              trans: transWrap,
              state: false
            }
          };
        }
      }

      //no wrap return
      return {
        _return: true,
        dataMap
      };

    };

    const setWrap = function (dataMap, wrap) {
      //need to update state target with props, brain dead.
      const type = dataMap.get('type');
      const wrapData = wrap.trans || wrap.state;
      //get formated data from stack
      const data = dataMap.getIn(['target', dataMap.get('type')]).last();

      //we want to make sure there are props to wrap, we don't
      //want of need to wrap an if only conains other objs
      const propsToWraps = data.get('data').some(function (propVal) {
        if (_.isString(propVal) || _.isArray(propVal) || _.isNumber(propVal)) {
          return true;
        }
      });

      //if no props kill
      if (!propsToWraps) {
        return {
          _return: true,
          dataMap
        };
      }

      //inherit option data
      const inherit = self.inherit(data);

      //gen the trans
      const genTrans = self.genTrans(data, wrapData, inherit);

      //media no need to inherit trans can pick up
      if (!genTrans && type === 'media') {
        //we don't want to gen for nonGen
        if (!dataMap.getIn(['option', '_nonGen'])) {
          return {
            dataMap
          };
        }

        //remove data since we don't want to gen
        dataMap = dataMap.update('target', function (_target) {
          return util.terminator({
            id: dataMap.get('id'),
            type: 'media',
            target: _target
          });
        });

        return {
          dataMap
        };
      }


      let transOption = inherit.option
                        ? wrapData.getIn(['option', 'raw']).mergeDeep(data.getIn(['option', 'raw']))
                        : data.getIn(['option', 'raw']);

      //clean this though pr-#207
      if (dataMap.getIn(['option', '_nonGen']) || wrapData.getIn(['option', 'specific', '_nonGen'])) {
        transOption = transOption.set('_nonGen', true);
      }

      //wrap in trans
      let transProp;
      //default
      if (!option.setInTarget) {
        transProp = inherit.prop
                    ? wrapData.get('data').merge(data.get('data'))
                    : data.get('data');

        let wrapMap = Immutable.Map({_transition: transProp});
        wrapMap = wrapMap.setIn(['_transition', 'option'], transOption);

        //set as new data
        dataMap = dataMap.set('data', wrapMap);
      }else {
        //media use case
        transProp = !inherit.prop
                    ? data.get('data')
                    : wrapData.get('data').reduce(function (map, val, key) {
                      //make sure we don't have key established
                      if (!map.has(key)) {
                        //don't want no imutables in this household
                        if (!Immutable.Map.isMap(val) && !Immutable.List.isList(val)) {
                          return map.set(key, val);
                        }
                      }
                      return map;
                    }, data.get('data'));

        //add in options
        transProp = transProp.set('option', transOption);

        //wrap trans
        transProp = Immutable.Map({
          _transition: transProp
        });

        //update target map type with new transProp data
        dataMap = dataMap.updateIn(['target', dataMap.get('type')], function (map) {
          return map.update((map.size - 1), function (_map) {
            return _map.set('data', transProp);
          });
        });
      }

      return {
        dataMap
      };

    };

    return teFlow.call({
      args: {
        dataMap: _dataMap
      }},
      configWrap,
      setWrap, {
        return: function (dataMap) {
          return dataMap;
        }
      }
    );
  },

  setStack: function (dataMap, target, option) {
    const self = this;
    //set default
    target = target ? target : Immutable.Map();
    option = option ? option : {};

    //@pr-#175
    return dataMap.withMutations(function (map) {
      return map
             .set('target', util.set(dataMap, target))
             .merge(self.wrap(map, option));
    });
  },

  set: function (dataMap, target, option) {
    const self = this;
    //set default
    target = target ? target : Immutable.Map();
    option = option ? option : {};

    //@pr-#175
    return dataMap.reduce(function (map, val, key) {
      return map.update(key, function (_map) {
        return _map.withMutations(function (__map) {
          return __map
                .set('target', util.set(_map, target))
                .merge(self.wrap(__map, option));
        });
      });
    }, dataMap);
  }
};


module.exports = targetWrap;
