const _           = require('lodash');
const throwErr    = require('./media-errors.js');

/**
 * This guy configs all the values for the mixins. It is based off of
 * @param  {str} type            -> Type of mixin
 * @param  {str || arr} mixinVal -> The value for said mixin to use
 * @param  {arr} breakPoints     -> The default break points set in stylus
 * @return {obj}                 -> {feture and value}
 */
const mediaMixinConfig = function (type, mixinVal, breakPoints) {
  //check for array value for mixin
  let append = type.match(/___\d/);
  append = append ? append[0] : '';
  type = append ? type.replace(/___\d/, '') : type;

  //checks if val is one of the defaults
  const getMQVal = function (val) {
    const def = breakPoints;
    //if user is a breakpoint ref such as 'lg'
    if (def[val]) {
      return {
        val: def[val],
        index: Math.abs(_.indexOf(_.keys(def), val))
      };
    }else if (_.isNumber(val) || val.match(/^\d+$/)) {
      //if only num assume corrosponding default
      const defKeys = _.keys(def);
      const defKey = defKeys[parseInt(val, 10)];
      const defVal = def[defKey];
      if (defVal) {
        return {
          val: defVal,
          index: Math.abs(_.indexOf(def, val))
        };
      }
      //throw err
      //@todo better error
      throwErr('notFound', {
        code: {[type]: mixinVal},
        msg: 'It looks like you where trying to use a num but none found'
      });
    }
    //Prbly a user error if this is returned but hell the user is never wrong
    return {
      val: val,
      index: false
    };
  };

  /*
  If gate
   */
  if (type === 'above' || type === 'from-width') {
    return {
      fet: 'min-width' + append,
      val: getMQVal(mixinVal).val
    };
  }else if (type === 'below' || type === 'to-width') {
    return {
      fet: 'max-width' + append,
      val: getMQVal(mixinVal).val
    };
  }else if (type === 'landscape') {
    return {
      fet: 'orientation',
      val: 'landscape'
    };
  }else if (type === 'portrait') {
    return {
      fet: 'orientation',
      val: 'portrait'
    };
  }else if (type === 'density') {
    //covert to string so that we don't throw
    mixinVal = _.isNumber(mixinVal) ? ('' + mixinVal) : mixinVal;
    //only digits
    if (mixinVal.match(/^\d+$/)) {
      return {
        fet: 'min-resolution' + append,
        val: mixinVal + 'dppx'
      };
    }
    //defined by user
    return {
      fet: 'min-resolution' + append,
      val: mixinVal
    };
  }else if (type === 'between') {
    if (_.isArray(mixinVal)) {
      return [{
        fet: 'min-width',
        val: getMQVal(mixinVal[0]).val
      }, {
        fet: 'max-width',
        val: getMQVal(mixinVal[1]).val
      }];
    }
    //throw error need to be arr
    throwErr('syntax', {
      exp: 'Array',
      rec: typeof val,
      code: {[type]: mixinVal},
      msg: 'If you do not fix this I will just ignore it.'
    });
  }else if (type === 'at') {
    const def = breakPoints;
    const max = _.keys(def).length - 1;
    mixinVal = getMQVal(mixinVal);
    const index = mixinVal.index;
    if (index === false) {
      //@todo better err
      throwErr('notFound', {
        code: {[type]: mixinVal},
        msg: 'Brha, no corrosponding value was found for your at media.'
      });
    }
    //max
    if (max === index) {
      return {
        fet: 'min-width',
        val: def[_.keys(def)[index - 1]]
      };
    }else if (index === 0) {
      //min
      return {
        fet: 'max-width',
        val: mixinVal.val
      };
    }
    //dups
    return [{
      fet: 'min-width',
      val: getMQVal(index - 1).val
    }, {
      fet: 'max-width',
      val: getMQVal(index).val
    }];
  }else {
    //throw err, mixin not found
    throwErr('notFound', {
      code: {[type]: mixinVal},
      msg: ['Unfortunaly, "' + type + '" is not a valid mixin type that I can',
            'use.'].join(' ')
    });
  }
};

module.exports = mediaMixinConfig;
