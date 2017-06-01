const Immutable   = require('immutable');
const teFlow      = require('te-flow');
const transition  = require('../transition/trans-index.js');
const extract     = require('./state-extract-helper.js');
const _T          = require('../target/target-index.js');
const _M          = require('../manager/manager-index.js');
const _H          = require('../helpers/helper-index.js');

//recusive bullshit
const stateExtract = function (stateMgr) {

  /*
  Inital data de-construction
   */
  const extractData = function (target) {
    //pluck state from state list
    const state = target.get('state').last();
    const data = state.get('data');
    let option = state.getIn(['option', 'specific']);
    //cycle out options if use helper is false
    option = option.get('use') !== false ? option : option.map(function (val, key) {
      if (key.startsWith('_')) {
        return val;
      }
    });
    option = option.getIn(['shorthand', 'use']) !== false ? option : option.delete('shorthand');

    return {
      state,
      data,
      option,
      target
    };
  };

  /*
  Formats props into maps to work with
   */
  const formatProps = function (state, data, option, target) {
    //hacky fix to process helpers
    data = _H.util.processHelper(data, target);

    //seperated props further to process
    data = data.reduce(function (map, val, key) {
      if (key === 'static') {
        return map.set('static', val);
      }else if (Immutable.Map.isMap(val)) {
        return map.update('object', function (_map) {
          return _map.set(key, val);
        });
      }

      return map.update('prop', function (_map) {
        return _map.set(key, val);
      });

    }, Immutable.fromJS({
      prop: {},
      object: {},
      static: {}
    }));

    const isEmpty = function (key) {
      return !data.get(key);
    };

    //kill if empty
    if (isEmpty('prop') && isEmpty('static') && isEmpty('object')) {
      return {
        _kill: true
      };
    }

    //remove static from state if present since now in data
    //and if we leave it in the state it will throw an infinate loop
    if (state.hasIn(['data', 'static'])) {
      state = state.deleteIn(['data', 'static']);
    }

    return {
      state,
      data,
      option,
      target
    };
  };


  /*
  Check to make sure we need to gen trans for state
   */
  const checkProps = function (state, data, option, target) {

    //makes sure we are working with more than just the option object
    const genPropTrans = data.get('prop').size !== 0;
    const genShorthand = option.has('shorthand') && option.get('shorthand').size !== 0;
    //check to make sure the autoGen is not false
    const omitOverride =  option.getIn(['_trans', option.get('_stateType')]);
    const hasStateTrans = genShorthand || (genPropTrans && (option.get('autoGen') || !omitOverride));
    if (!hasStateTrans) {
      //If it gets here it prbly means that that there is no trans props
      //and just static props to process, or atleast in theroy

      //add in target ref
      state = state.set('target', target);

      //set trans data as the static data to avoid additional logic
      data = data.set('trans', data.get('static'));

      //set state
      state = extract.setState(data, state);
      //queue state
      _M._queue.add(state);

      //kill cus there is no trans to generate
      return {
        _kill: true
      };
    }

    return {
      state,
      data,
      option,
      target
    };
  };


  /*
  Generates transtion for state
   */
  const generateTrans = function (state, data, option, target) {
    //set override if any
    const override = state.getIn(['option', 'target', 'override']);
    option = override ? option.set('override', override) : option;

    //get/process the trans
    const transList = transition(
      'customTrans__StateProcess',
      data.get('prop').mergeDeep({option: option}).toJS(), target, {
        stackProcess: true
      }
    );

    //cycle the resulting trans list
    transList.forEach(function (res) {
      //grab results
      const trans = res.trans;
      const transTarget = res.target;

      //merge targets to update
      const mergedTarget = _T.merge(target, transTarget);

      //update state with target and trans ref
      let stateCopy = state.withMutations(function (map) {
        return map
               .set('target', mergedTarget)
               .set('trans', trans);
      });

      //set the trans within data to be merged/handled in `setState`
      const dataCopy = data.set('trans', trans);

      //set states data
      stateCopy = extract.setState(dataCopy, stateCopy);

      //queue
      if (stateCopy) {
        _M._queue.add(stateCopy);
      }
    });
  };

  /*
  The while river that pulls the data from the stateMgr
   */
  let target = stateMgr.next();
  while (target) {
    //extranct and add
    teFlow.call({
      args: {
        target: target
      }},
      extractData,
      formatProps,
      checkProps,
      generateTrans
    );
    //next key
    target = stateMgr.next();
  }

};

module.exports = stateExtract;
