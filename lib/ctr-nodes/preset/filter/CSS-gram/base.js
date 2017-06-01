const _ = require('lodash');

const base = {
  position: 'relative',
  customComponentFilterImage: {
    option: {
      key: 'img',
      selector: false,
      //internal option prop
      conflictSrc: true
    },
    width: '100%',
    'z-index': '1'
  },
  customElementFilterBefore: {
    option: {
      key: 'before',
      conflictSrc: true
    },
    content: false,
    display: 'block',
    height: '100%',
    width: '100%',
    top: '0',
    left: '0',
    position: 'absolute',
    'pointer-events': 'none',
    'z-index': '2'
  },
  customElementFilterAfter: {
    option: {
      key: 'after',
      conflictSrc: true
    },
    content: false,
    display: 'block',
    height: '100%',
    width: '100%',
    top: '0',
    left: '0',
    position: 'absolute',
    'pointer-events': 'none',
    'z-index': '3'
  }
};

/**
 * Merges with base to return
 * @return {obj}
 */
const mergeWithStyle = function (val) {
  const keyOrder = [
    'filter', 'position', 'customComponentFilterImage',
    'customElementFilterBefore', 'customElementFilterAfter',
    'customElementsFilter'
  ];
  /**
   * Sorta, meh, but it sorts the obj into same order of that of CSSGram
   */
  const sortObject = function (_obj) {
    return _.keys(_obj)
    .sort(function (a, b) {
      const ax = keyOrder.indexOf(a);
      const bx = keyOrder.indexOf(b);
      if (ax === -1) {
        return 0;
      }else if (bx === -1) {
        return 1;
      }else if (ax > bx) {
        return 1;
      }else if (bx > ax) {
        return 0;
      }
      return 0;
    })
    .reduce(function (result, key) {
      result[key] = _obj[key];
      return result;
    }, {});
  };

  //sort and return
  const obj = sortObject(_.defaultsDeep(val, _.clone(base)));
  return obj;
};

module.exports = mergeWithStyle;
