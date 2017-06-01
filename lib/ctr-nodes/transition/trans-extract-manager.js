const _          = require('lodash');
const defclass   = require('defclass');
const _T         = require('./../target/target-index.js');

/*
This guy is in charge of handeling and managing all the trans
extract data which is then composed
 */
const TransExtractManager = defclass({
  constructor: function (target) {
    const self = this;

    self.target = target;

    const trans = target.get('transition').last();

    self.id = trans.get('id');
    self.data = trans.get('data');
    self.option = trans.get('option');

    self.transOption = {
      property: [],
      duration: [],
      ease: [],
      delay: []
    };
  },
  /**
   * Add is used for pushing vals into the trans lists
   * @param {str} key -> One of the this.transOption keys
   * @param {str} val -> The value of the key
   */
  add: function (key, val) {
    this.transOption[key].push(val);
  },
  /**
   * Gets and returns, note of the hardcode props to make
   * life a bit easier
   * @param  {str} key     -> The key to get
   * @param  {str} getFrom -> The data to get from
   * @return {---}         -> List or corrosponding data
   */
  get: function (key) {
    if (key === 'data') {
      return this.data.toJS();
    }
    return this.transOption[key];
  },
  /**
   * Omit is a special cat and is the only auxOption that will be update
   * @param  {str || arr} val -> The vals we wish to omit from the trans
   * @return {---}            -> Updates this.data omit
   */
  updateOmit: function (val) {
    this.option = this.option.updateIn(['specific', '_trans'], function (omitList) {
      return omitList.push(val);
    });
  },
  /**
   * Our main man, get us the options we need to figure out what we are
   * working with. Note, based on the optKey it will set the map as either
   * auxOption or option for code clarity and shit.
   * @param  {str} optKey -> The option we wish to get
   * @return {val}        -> Whatever the value for the option is.
   */
  //@clean
  getOption: function (optKey) {
    const key = optKey.key ? optKey.key : optKey;
    const user = optKey.user;

    if (!user && _.isString(key)) {
      let option = this.option.getIn(['specific', key]);

      //return if present
      if (!_.isUndefined(option)) {
        if (_.isString(option) || _.isBoolean(option)) {
          return option;
        }
        return option.toJS();
      }

      //else lets check return default for last ditch effort
      option = this.option.getIn(['specific', '_default', key]);

      if (!_.isUndefined(option)) {
        if (_.isString(option) || _.isBoolean(option)) {
          return option;
        }
        return option.toJS();
      }
      return option;
    }

    //default key
    if (optKey.user === 'default') {
      //check local option first
      const localOption = this.option.getIn(['specific', key]);
      if (localOption) {
        return localOption;
      }
      //else default
      return this.option.getIn(['specific', '_default', key]);
    }else if (user) {
      return user;
    }
  },
  /**
   * Gets the default trans opts
   * @param  {str} key -> The option, such as `duration`
   * @return {str}     -> The default option
   */
  getDefault: function (optKey) {
    const option = this.option.getIn(['specific', '_default', optKey]);
    return option;
  },
  /**
   * Updates the target with the new trans data
   * @param  {map} trans -> trans data
   * @return {map}       -> updated target
   */
  updateTarget: function (trans) {
    const self = this;
    const target = self.target;
    const id = self.id;

    return _T.util.update(target, {
      type: 'transition',
      id: id,
      val: trans,
      key: 'trans'
    });
  },
  /**
   * Wrapper to get raw data from construc
   * @param  {str} key -> data key we want
   * @return {---}     -> whatever it may be
   */
  getRaw: function (key) {
    const self = this;
    return self[key];
  }
});

module.exports = TransExtractManager;
