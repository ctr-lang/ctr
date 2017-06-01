const _         = require('lodash');
const defclass  = require('defclass');
const Immutable = require('immutable');

/*
This is fucking stupid but I can pull in the util merge
since shit gets fucked for some reason
 */
const merge = function (srcObj) {
  //clone to be safe and break and refs
  srcObj = _.cloneDeep(srcObj) || {};
  let args = new Array(arguments.length);
  let overwrite = false;

  //cycle args which will be objs to be merged into
  for (let i = 0; i < args.length; ++i) {
    //checks for true as last arg for overwrite
    if (i + 1 === args.length && arguments[i] === true) {
      overwrite = true;
    }else {
      args[i] = arguments[i];
    }
  }

  /*
  Wrapper funk to merge obj into the sorce obj, its inkvoked
  via the bellow loop
   */
  const mergeObject = function  (obj) {
    //clone to be safe and break and refs
    obj = _.cloneDeep(obj);
    //cycle keys
    for (let key in obj) {
      if ({}.hasOwnProperty.call(obj, key)) {
        let value = obj[key];
        //no val
        if (_.isUndefined(srcObj[key])) {
          srcObj[key] = value;
        }else if (value && value.constructor === Object) {
          //obj val, check if the src obj is an object if so
          //try to merge where possible
          if (_.isPlainObject(srcObj[key])) {
            srcObj[key] = merge(srcObj[key], value, overwrite);
          }else if (overwrite) {
            srcObj[key] = value;
          }
        }else if (overwrite) {
          srcObj[key] = value;
        }
      }
    }
  };

  //loop through args
  for (let i = 1; i < args.length; i++) {
    let obj = args[i];
    //make sure object is not empty
    if (!_.isEmpty(obj)) {
      //merge obj into srcObj
      mergeObject(obj);
    }
  }

  //-> `merege` return
  return srcObj;
};

/**
 * This little guy stores all the defaults set in crt-defualts
 */
const OptionManager = defclass({
  constructor: function (ctrUserOption, initOption) {
    const self = this;
    self.ctrUserOption = _.isEmpty(ctrUserOption) ? false : _.cloneDeep(ctrUserOption);

    //check for trans master default
    let setTransDefault = ctrUserOption && ctrUserOption.transitionDefault;

    let transitionDefualt = {
      duration: '0.5s',
      ease: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
      delay: '0s'
    };

    //check option to set defaults need be
    if (setTransDefault) {
      transitionDefualt = _.defaults(setTransDefault, transitionDefualt);
    }
    self.ctrDefualts = {
      //global
      global: {
        //for each fn it runs through to check
        //if any of the following opts are applied locally
        checkLocally: true,
        //'len', '-len', 'abc', '-abc'
        sort: 'len',
        //adds media to queue so that its
        //processed after non-mediaQ
        queueMedia: true,
        queueAnimation: true,
        //supresses error reporter
        errorSuppress: false,
        //font-smoothing
        fontSmoothing: true,
        //edit color
        editColor: 'rgba(0,0,255,0.1)',
        //double colon
        doubleColon: true,
        //level || order
        //level -> process scope level and then moves onto the next nested level
        //order -> process by order, first come, process till complete then move
        processBy: 'level',
        //process override
        processStyle: true,
        processMedia: true,
        processTimeline: true,
        //shorthand anim prop
        animationShorthand: false,
        //shorthand trans prop
        transitionShorthand: false,
        //stylus list of key that will be ingnored in trans
        //ex. 'content', 'left', 'right';
        transitionOmitList: ['content', 'position', 'cursor', 'display', 'clear'],
        stateOmitList: ['link', 'visited', 'optional', 'required', 'valid'],
        //memoize can also be set in ctr options
        memoize: initOption.memoize,
        // memoize: false,
        //memoize cache size
        memoizeLimit: 5000
        //@todo, possibly auto merge conflicts
        //media q conflict average
        //if conclicting media qs average
        // mediaAverageConflict: true
      },
      //Transition
      transitionDefault: transitionDefualt,
      transition: transitionDefualt,
      hover: transitionDefualt,
      active: transitionDefualt,
      focus: transitionDefualt,
      visited: transitionDefualt,
      link: transitionDefualt,
      customState: transitionDefualt,
      //animation
      animation: {
        duration: '0.5s',
        ease: 'cubic-bezier(0.420, 0.000, 0.580, 1.000)',
        delay: '0s',
        count: '1',
        direction: 'normal',
        mode: 'none',
        state: 'running'
      },
      //media
      media: {
        xs: '400px',
        sm: '600px',
        md: '800px',
        lg: '1050px',
        hd: '1800px'
      },
      //grid
      grid: {
        gutter: '30px',
        rtl: false,
        flexbox: true
      },
      //type
      type: {
        rootSize: '16px',
        fontSize: {
          minSize: '12px',
          maxSize: '21px',
          //pull in set media if invoked
          minWidth: null,
          maxWidth: null
        },
        lineHeight: {
          minSize: '1rem',
          maxSize: '2rem',
          //pull in set media if invoked
          minWidth: null,
          maxWidth: null
        },
        letterSpacing: {
          minSize: '3px',
          maxSize: '10px',
          //pull in set media if invoked
          minWidth: null,
          maxWidth: null
        }
      },
      //private
      //transition props
      _transitionProps: ['transition', 'transition-property', 'transition-duration',
      'transition-timing-function', 'transition-delay', 'will-change'],
      //animation props
      _animationProps: ['animation', 'animation-name', 'animation-duration',
      'animation-timing-function', 'animation-iteration-count', 'animation-delay',
      'animation-direction', 'animation-fill-mode', 'animation-play-state']
    };

    //if user has defined options merge
    if (self.ctrUserOption) {
      self.ctrDefualts = merge(self.ctrUserOption, self.ctrDefualts);
    }

    self.map = Immutable.fromJS(self.ctrDefualts);
  },
  hasIn: function (key = []) {
    return this.map.hasIn(key);
  },
  setIn: function (key = [], val) {
    this.map = this.map.setIn(key, Immutable.fromJS(val));
  },
  getIn: function (key = []) {
    const val = this.map.getIn(key);
    if (_.isUndefined(val) || val === null) { return null; }

    if (val.toJS) {
      return val.toJS();
    }
    return val;
  },
  //for memomizing
  getGlobalOption: function () {
    return this.ctrUserOption;
  },
  //Updates defualt trans if merging through local options
  //@hacky fix for #388
  updateTransDefault: function (data) {
    const self = this;
    const update = ['transitionDefault', 'transition', 'hover', 'active', 'focus', 'visited', 'link', 'customState'];
    _.forEach(update, function (val) {
      self.map = self.map.updateIn([val], function (_val) {
        return _val.merge(data);
      });
    });
  },
  //merges in data from local data option
  mergeIn: function (key, mergeData) {
    this.map =  this.map.mergeDeepIn(key, mergeData);
  }
});

module.exports = OptionManager;
