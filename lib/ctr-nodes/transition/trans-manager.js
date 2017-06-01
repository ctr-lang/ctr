const _          = require('lodash');
const teFlow     = require('te-flow');
const Immutable  = require('immutable');
const defclass   = require('defclass');
const _T         = require('../target/target-index.js');
const _M         = require('../manager/manager-index.js');
const _H         = require('../helpers/helper-index.js');

const TransManager = defclass({
  constructor: function (globalData, option) {
    const self = this;
    //stack which we will set/get from
    self.stack = Immutable.List();

    //config option
    self.stackProcess = option.stackProcess;

    //Grab the default options
    const defaultOption = _M._option.getIn(['transitionDefault']);
    const defaultTrans   = _M._option.getIn(['global', 'transitionOmitList']);
    const animOmit      = _M._option.getIn(['_animationProps']);
    const internalOmit  = ['mixin', 'media', 'query', 'animation', 'anim',
    'transition-property', 'transition-duration', 'transition-timing-function',
    'transition-delay', 'option'];

    //set refs
    self.globalData   = globalData || {};
    // self.globalData   = _.omit(globalData, 'option') || {};
    self.defaultOption = defaultOption;
    self.defaultTrans  = _.isArray(defaultTrans) ? defaultTrans : [defaultTrans];
    self.defaultTrans  = _.union(self.defaultTrans, animOmit, internalOmit);
  },

  /**
   * Configs the options and sets in the defaults
   * @param  {obj} option -> option object for the trans
   * @return {obj}        -> Configed option object
   */
  configOption: function (option, data) {
    const self = this;

    //check for and add in omits and format
    let trans = _.has(option, 'trans') ? _.get(option, 'trans') : _.get(option, 'transition');
    if (trans || trans === false) {
      //convert to array need be
      trans = _.isArray(trans) ? trans : [trans];
      //check for true if so key is `all`
      option._trans = trans === false ? ['all'] : _.reduce(data, function (prv, val, key) {
        //so we want to add every prop that is not in the trans list, I know its backwards
        //of what it should be but I fucked up here, and the naming convention of trans
        //used to be omit, but now omit is a diffrent feature, thus the backwardness
        if (!_.includes(trans, key)) { prv.push(key); }
        return prv;
      }, []);
    }

    //we set a ref to the default options here, which we then
    //can look up if needed. May not be the cleanest of
    //methods, but its effecient and we dont have to then
    //pass around another object
    option._default = option._default ? option._default : self.defaultOption;
    //union or default the omit option
    const defaultTrans = self.defaultTrans;
    option._trans = !option._trans
                  ? defaultTrans
                  : _.union(option._trans, defaultTrans);

    return option;
  },

  /**
   * Configs the data obj, really just merges the shit with any
   * defaults if needed.
   * @param  {obj} data -> trans data obj
   * @return {obj}      -> obj merged with defaults
   */
  configData: function (data, key) {
    const self = this;
    //config/merge global data if present
    data = _.isEmpty(self.globalData)
         ? data
         : _H.util.mergeGlobal({
           val: data,
           key: key,
           globalData: self.globalData
         });

    return data;
  },

  /**
   * This will configure the data and then push that data into the
   * statck list which then we will get via `next` in the trans
   * extractor
   * @param {obj} _data -> trans data obj
   */
  set: function (_data, _key) {
    const self = this;

    /**
     * Configs the data and options respectivly
     * @param  {obj} data   -> trans data obj
     * @param  {obj} option -> option ojb for trans data
     * @return {---}        -> configed {data, option}
     */
    const config = function (data, key) {
      //find shortand if in global, and place in option obj
      ({data} = _H.findKey(data, ['shorthand'], {
        addToOption: true,
        optionKey: 'shorthand',
        depth: 1
      }));

      //config data
      data = self.configData(data, key);
      //seperate option form data
      let option;
      ({data, option} = _H.util.getOption(data));
      //config options
      option = self.configOption(option, data);

      return {
        data,
        option
      };
    };

    /**
     * Sets the target ref based on the data and option
     * objects which in turn we will push to the stack
     * @param {obj} data   -> trans data obj
     * @param {obj} option -> option for the trans data
     */
    const setStack = function (data, option) {
      //unique id for trans
      const transId = _H.util._id.gen('transition');
      let dataMap = Immutable.fromJS({
        key: '',
        data: data,
        option: option,
        type: 'transition',
        id: transId,
        stackProcess: self.stackProcess
      });

      dataMap = dataMap.set('target',
        _T.util.set(dataMap)
      );

      //add to stack
      self.stack = self.stack.push(dataMap.get('target'));
    };

    //-> call order
    teFlow.call({
      args: {
        data: _data,
        key: _key
      }},
      config,
      setStack
    );
  },

  /**
   * Gets next value in line in the map
   * @return {obj} -> composed of maps with data to be processed
   */
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

module.exports = TransManager;
