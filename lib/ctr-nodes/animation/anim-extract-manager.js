const _          = require('lodash');
const defclass   = require('defclass');
const _H         = require('../helpers/helper-index.js');
const _T         = require('./../target/target-index.js');

/*
This guy is in charge of handeling and managing all the anim
extract data which is then composed
 */
const AnimExtractManager = defclass({
  constructor: function (target) {
    const self = this;

    self.target = target;

    //get animation instance
    const anim = target.get('animation').last();

    self.id = anim.get('id');
    self.data = anim.get('data');
    self.option = anim.get('option');


    this.animOption = {
      duration: [],
      ease: [],
      delay: [],
      count: [],
      direction: [],
      mode: [],
      state: [],
      name: []
    };
  },
  /**
   * Add is used for pushing vals into the anim lists
   * @param {str} key -> One of the this.anim keys
   * @param {str} val -> The value of the key
   */
  add: function (key, val) {
    this.animOption[key].push(val);
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
    return this.animOption[key];
  },
  /**
   * Our main man, get us the options we need to figure out what we are
   * working with.
   * @param  {str} optKey -> The option we wish to get
   * @return {val}        -> Whatever the value for the option is.
   */
  getOption: function (optKey) {
    const key = optKey.key ? optKey.key : optKey;
    const user = optKey.user;

    if (!user && _.isString(key)) {
      let option = this.option.getIn(['specific', key]);

      //return if present
      if (!_.isUndefined(option)) {
        if (_.isString(option) || _.isBoolean(option) || !option.toJS) {
          return option;
        }
        return option.toJS();
      }

      //else lets check return default for last ditch effort
      option = this.option.getIn(['specific', 'default', key]);

      if (!_.isUndefined(option)) {
        if (_.isString(option) || _.isBoolean(option) || !option.toJS) {
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
      return this.option.getIn(['specific', 'default', key]);
    }else if (user) {
      return user;
    }
  },
  /**
   * Gets the default anim opts
   * @param  {str} key -> The option, such as `duration`
   * @return {str}     -> The default option, althogh, theres a catch, theres
   *                      always a damn catch. Since in somecases with shorthand
   *                      we have to make sure the option is not defiend before
   *                      we return the default cus otherwise we want whats defined
   */
  getDefault: function (optKey) {
    const option = this.option.getIn(['specific', 'default', optKey]);
    return option;
  },
  /**
   * Sets the final data struct to be returned from anim, mereges
   * the anim props and the raw props
   * @param  {obj} fmtAnim -> assigned anim obj
   * @return {map}          -> map with data
   */
  setAndGet: function (anim) {
    const self = this;
    let target = self.target;
    const id = self.id;
    const data = self.data;

    //merge trans with data
    anim = _H.util.merge(data.toJS(), anim);

    //update target
    target = _T.util.update(target, {
      type: 'animation',
      id: id,
      val: anim,
      key: 'anim'
    });

    return {
      target,
      anim
    };
  }
});

module.exports = AnimExtractManager;
