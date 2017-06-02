const _           = require('lodash');
const throwErr    = require('./helper-throw-err.js');
const Immutable   = require('immutable');
const _M          = require('../manager/manager-index.js');

const responsiveType = {
  rangKeys: {
    fontSize: 'font-size-range',
    lineHeight: 'line-height-range',
    letterSpacing: 'letter-spacing-range'
  },
  rootKeys: {
    fontSize: 'font-size-root',
    lineHeight: 'line-height-root',
    letterSpacing: 'letter-spacing-root'
  },
  expandedKeys: {
    fontSize: {
      minSize: 'min-font-size',
      maxSize: 'max-font-size',
      minWidth: 'min-font-size-range',
      maxWidth: 'max-font-size-range'
    },
    lineHeight: {
      minSize: 'min-line-height',
      maxSize: 'max-line-height',
      minWidth: 'min-line-height-range',
      maxWidth: 'max-line-height-range'
    },
    letterSpacing: {
      minSize: 'min-letter-spacing',
      maxSize: 'max-letter-spacing',
      minWidth: 'min-letter-spacing-range',
      maxWidth: 'max-letter-spacing-range'
    }
  },

  /**
   * Gets root size
   * @return {str} -> root size
   */
  rootSize: function () {
    return _M._option.getIn(['type', 'rootSize']);
  },

  /**
   * Gets default size from option
   * @param  {str} type -> type of q
   * @param  {str} prop -> prop
   * @return {str}      -> default
   */
  getDefaultSize: function (type, prop) {
    const res = _M._option.getIn(['type', type, prop]);
    if (res === null) {
      const media = _M._option.getIn(['media']);
      const keys = _.keys(media);
      if (prop === 'minWidth') {
        return media[keys[0]];
      }
      //max size otherwise
      return media[keys[keys.length - 1]];
    }
    return _M._option.getIn(['type', type, prop]);
  },

  /**
   * Gets the size
   * @param  {str} key        -> key type --> font-size, line, letter
   * @param  {str} type       -> query
   * @param  {---} val        -> cur val, str or list
   * @param  {map} staticArgs -> map
   * @return {str}            -> string val
   */
  getSize: function (key, type, val, staticArgs) {
    const self = this;
    //check shorthand
    if (_.isArray(val)) {
      //shorthand minSize
      if (type === 'minSize' && val[1]) {
        return val[1];
      }else if (type === 'maxSize' && val[2]) {
        return val[2];
      }
    }

    //check rang shorthand
    const rangKey = self.rangKeys[key];
    const arg = staticArgs.get(rangKey);
    if (_.isArray(arg)) {
      if (type === 'minWidth' && arg[0]) {
        return arg[0];
      }else if (type === 'maxWidth' && arg[1]) {
        return arg[1];
      }
    }

    //check expanded syntax
    const expanded = self.expandedKeys[key][type];
    if (staticArgs.has(expanded)) {
      return staticArgs.get(expanded);
    }

    return self.getDefaultSize(key, type);
  },

  /**
   * Cleans the staticArgs for responsive props to be
   * then repopulated
   * @param  {str} key        -> type
   * @param  {map} staticArgs
   * @return {map}            -> cleaned
   */
  clean: function (key, staticArgs) {
    const self = this;
    const expanded = self.expandedKeys[key];
    //remove key
    staticArgs = staticArgs.delete(key);
    staticArgs = staticArgs.delete(self.rangKeys[key]);

    //remove and extended keys
    _.forEach(_.keys(expanded), function (val) {
      const expKey = expanded[val];
      staticArgs = staticArgs.delete(expKey);
    });

    return staticArgs;
  },

  /**
   * Checks vals on indv level for some resue
   * @return {bln}
   */
  checkIndv: function (val) {
    if (val === 'responsive') {
      return true;
    }else if (_.isArray(val) && val[0] === 'responsive') {
      return true;
    }
    return false;
  },


  //remove local root
  removeLocalRoot: function (staticArgs, rootKey) {
    staticArgs = staticArgs.remove(rootKey);
    return staticArgs;
  },

  /**
   * Checks for local root
   * @param  {str}  key -> lookup key -> font-size
   * @return {bln}
   */
  hasLocalRoot: function (staticArgs, key) {
    const localKey = this.rootKeys[key];
    if (staticArgs.has('root-size')) {
      return 'root-size';
    }else if (staticArgs.has('rootSize')) {
      return 'rootSize';
    }else if (localKey && staticArgs.has(localKey)) {
      return localKey;
    }

    return false;
  },

  /**
   * Px -> Rem converter
   * @param  {String} px pixel value
   * @return {String}    rem value
   */
  pxConvert: function (px, prefix, rootSize = null) {
    rootSize = rootSize || this.rootSize();
    const num = parseFloat(px) / parseFloat(rootSize);
    return num.toFixed(3) + prefix;
  },

  /**
   * Extract the unit from a string
   * @param  {String} value value to extract unit from
   * @return {String}       unit
   */
  getUnit: function (val) {
    const match = val.match(/px|rem|em/);

    if (match) {
      return match.toString();
    }
    // unitless value
    return null;
  },
  build: function (key, val, staticArgs, target) {
    const self = this;

    //set lookup key which need to be camelCased
    let lookupKey;
    if (key === 'font-size') {
      lookupKey = 'fontSize';
    }else if (key === 'letter-spacing') {
      lookupKey = 'letterSpacing';
    }else if (key === 'line-height') {
      lookupKey = 'lineHeight';
    }

    //sizes
    const minSize = self.getSize(lookupKey, 'minSize', val, staticArgs);
    const maxSize = self.getSize(lookupKey, 'maxSize', val, staticArgs);
    const minWidth = self.getSize(lookupKey, 'minWidth', val, staticArgs);
    const maxWidth = self.getSize(lookupKey, 'maxWidth', val, staticArgs);


    //units
    const sizeUnit = self.getUnit(minSize);
    const maxSizeUnit = self.getUnit(maxSize);
    const widthUnit = self.getUnit(minWidth);
    const maxWidthUnit = self.getUnit(maxWidth);

    //format
    let _minWidth = minWidth;
    let _maxWidth = maxWidth;
    if ((sizeUnit === 'rem' || sizeUnit === 'em') && widthUnit === 'px') {
      const rootSizeKey = self.hasLocalRoot(staticArgs, lookupKey);
      let rootSize;
      if (rootSizeKey) {
        rootSize = staticArgs.get(rootSizeKey);
        staticArgs = self.removeLocalRoot(staticArgs, rootSizeKey);
      }
      staticArgs = staticArgs.remove('rootSize');
      staticArgs = staticArgs.remove('root-size');
      _minWidth = self.pxConvert(minWidth, sizeUnit, rootSize);
      _maxWidth = self.pxConvert(maxWidth, sizeUnit, rootSize);
    }else if (self.hasLocalRoot(staticArgs, lookupKey)) {
      staticArgs = self.removeLocalRoot(staticArgs, self.hasLocalRoot(staticArgs, lookupKey));
      throwErr({
        type: 'Format',
        msg: 'The root-size only works with em or rem.'
      });
    }

    //error checks
    if (sizeUnit === null) {
      throwErr({
        type: 'Format',
        msg: 'sizes with unitless values are not supported',
        code: staticArgs.toJS()
      });
      return staticArgs;
    }else if (sizeUnit !== maxSizeUnit || widthUnit !== maxWidthUnit) {
      throwErr({
        type: 'Format',
        msg: 'min/max unit types must match',
        code: staticArgs.toJS()
      });

      return staticArgs;
    }

    //delete + clean static args
    staticArgs = self.clean(lookupKey, staticArgs);

    // Build the responsive type decleration
    const sizeDiff = (parseFloat(maxSize) - parseFloat(minSize)).toFixed(3);
    const rangeDiff = (parseFloat(_maxWidth) - parseFloat(_minWidth)).toFixed(3);
    const size = 'calc(' + minSize + ' + ' + sizeDiff + ' * ((100vw - ' + _minWidth + ') / ' + rangeDiff + '))';

    const mediaData = {
      'media-__minWidthMedia__': {
        [key]: minSize,
        query: {
          'max-width': minWidth,
          type: 'screen'
        }
      },
      'media-__maxWidthMedia__': {
        [key]: maxSize,
        query: {
          'min-width': maxWidth,
          type: 'screen'
        }
      }
    };
    _M._queue.add(Immutable.Map({
      data: Immutable.fromJS(mediaData),
      target: target
    }), {
      // processNow: true
    });


    staticArgs = staticArgs.set(key, size);

    return staticArgs;
  },

  /**
   * Creates style
   * @param  {map} staticArgs
   * @param  {map} target
   * @param  {str} key        -> dah key
   */
  create: function (staticArgs, target, key) {
    const self = this;

    //cycle check
    const val = staticArgs.get(key);
    if (self.checkIndv(val)) {

      //has data to be processed
      staticArgs = self.build(key, val, staticArgs, target);
    }

    return staticArgs;
  }
};


module.exports = responsiveType;
