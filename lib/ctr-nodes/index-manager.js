const _         = require('lodash');
const Immutable = require('immutable');
const defclass  = require('defclass');
const _T        = require('./target/target-index.js');
const _H        = require('./helpers/helper-index.js');
const _M        = require('./manager/manager-index.js');

const IndexManager = defclass({
  constructor: function (stack = null) {
    const self = this;
    //get options
    self.sort       = _M._option.getIn(['global', 'sort']);
    self.animProps  = _M._option.getIn(['_animationProps']);
    self.transProps = _M._option.getIn(['_transitionProps']);

    //stack
    self.stack = stack || Immutable.OrderedMap();
  },
  addTimeline: function (data) {
    const self = this;
    const id = 'animation-' + Math.random().toString(36).substr(2, 9);

    self.stack = self.stack.set(id, Immutable.fromJS({
      type: 'animation',
      data: data
    }));
  },

  /**
   * Helper for below update to check and resolve conflics
   */
  checkResolve: function ({conflictResolve, val, key, _map}) {
    let conflict = _.get(conflictResolve, 'conflict');
    conflict = _.isArray(conflict) ? conflict : [conflict];
    if (_.includes(conflict, val)) {
      return _map.set(key, val);
    }else if (_.includes(conflict, _map.toJS()[key])) {
      return _map.set(key, _map.toJS()[key]);
    }
    console.info(`*****!! I found a conflict option but - ${JSON.stringify(conflict)}
    - does not match the two options, ${val} or ${_map.toJS()[key]}  !!******`.red.bold);
  },

  /**
   * janky as fuck, but it works, basically we have to update/merge my butcher
   * target data struc while checking for conflicts and such. Hopefully only
   * I, te, will have to deal with this shit, if at all. Otherwise I take
   * pitty on your soul.
   * @param  {str} id     -> selector id - (<selector>:<comb>:<key>...)
   * @param  {obj} data   -> data to update/merge
   * @param  {imt} target -> source target
   * @return {---}        -> updated statck
   */
  update: function (id, data, target) {
    const self = this;

    if (!self.stack.has(id)) {
      return self.stack.set(id, Immutable.Map({
        data: data,
        target: target
      }));
    }
    const _target = target.toJS();

    //janky as fuck, but it works, basically we have to merge my butcher
    //target data struc while checking for conflicts and such
    return self.stack.updateIn([id, 'data'], function (map) {
      //reduce and re-use
      return data.reduceRight(function (_map, val, key) {
        if (!_map.has(key)) {
          return _map.set(key, val);
        }else if (_.includes(self.transProps, key)) {
          //trans merge strings
          return _map.set(key, _map.get(key).concat(', ', val));
        }else if (_.includes(self.animProps, key)) {
          //anim merge strings
          return _map.set(key, _map.get(key).concat(', ', val));
        }

        //ignore duplicated taht are equal, display: flex for example
        if (_map.get(key) !== val) {
          //check for conflic resolve, pretty hacky but this was last minnutes
          //and at this points its the best I can do
          const conflictTarget = self.stack.getIn([id, 'target']).toJS();
          const conflictId = _.last(conflictTarget.stack);
          const conflictResolve = _.get(_.last(_.get(conflictTarget, [conflictId.type])), ['option', 'specific']);
          if (_.has(conflictResolve, 'conflict')) {
            const resolve = self.checkResolve({conflictResolve, val, key, _map});
            if (resolve) {
              return resolve;
            }
          }else if (_.has(conflictResolve, 'conflictSrc')) {
            return _map.set(key, val);
          }

          //try checking the source? I'm not sure if that is right everytime.
          //Lets just hope no one dies, like the main character, this is america not japan
          const lastHope = _.get(_.last(_.get(_target, conflictId.type)), ['option', 'specific']);
          if (_.has(lastHope, 'conflict')) {
            const resolve = self.checkResolve({lastHope, val, key, _map});
            if (resolve) {
              return resolve;
            }
          }else if (_.has(lastHope, 'conflictSrc')) {
            return _map.set(key, _map.toJS()[key]);
          }

          //throws warning header
          _H.throwErr({type: 'Duplicate Property Conflict'});
          console.info('Location |=> ', id);
          console.info('Property |=> ', key);
          console.info('Code     |=>',  _map.toJS());
          console.info('Current  |=>',  {[key]: val});
          console.info('Conflict |=>', {[key]: _map.toJS()[key]});
          console.info('Message  |=>', `Oh no, a Person vs. Technology conflict!
             This duplication error will not go away until you resolve the duplicate conflict.
             To resolve this issue, you must specify a "conflict" option Object property whose
             value is either a String or an Array of the property value you wish to use.
             Either {option: {conflict: ${val}}} or {option: {conflict: ${_map.toJS()[key]}}}
             The location of this conflict Option property should be at
             selector: ${id}
             NOTE: You may have to play around with the location of the option Object.`,
            '\n❤ ');
        }

        return _map;
      }, map);
    });
  },

  set: function (data, target) {
    const self = this;
    //set id to gen
    target = _T.util.setId(target);
    const id = target.get('id');
    //set stack
    self.stack = self.update(id, data, target);

  },

  next: function () {
    const self = this;
    //next
    const next = self.stack.entries().next();
    //nothing left
    if (next.done) { return false; }
    //assing
    const [id, val] = next.value;
    //remove id from map
    self.stack = self.stack.delete(id);
    //get
    const data   = val.get('data').toJS();
    const type   = val.get('type') || 'style';
    const target = val.get('target');

    return {
      data: data,
      type: type,
      target: target
    };
  }
});

module.exports = IndexManager;

