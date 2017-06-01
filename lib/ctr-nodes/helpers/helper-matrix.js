const _        = require('lodash');
const ToMatrix = require('./helper-matrix-lib');
const throwErr = require('./helper-throw-err.js');

// http://ds-overdesign.com/transform/matrix3d.html
const returnMatrix = function (matrixObj, staticArgs) {
  const matrix = new ToMatrix();
  //cycle
  const trans = [
    'perspective', 'rotate', 'rotateX', 'rotateY', 'rotateZ', 'rotate3d',
    'scale', 'scaleX', 'scaleY', 'scaleZ', 'scale3d', 'skew', 'skewX', 'skewY',
    'translate', 'translateX', 'translateY', 'translateZ', 'translate3d'
  ];

  //sanitizes since we can only use pixle, we can use deg and rad though
  const sanitize = function (val) {
    //num stafty check for ctrJS
    val = _.isString(val) ? val : val.toString();
    if (val.includes('deg') || val.includes('rad')) {
      return val;
    }else if (val.includes('px')) {
      val = parseInt(val);
    }else if (val.match(/[a-zA-Z]+/gi) || val.includes('%')) {
      throwErr({
        type: 'Format',
        code: val,
        msg: 'You can only use px, deg, or rad! That means you have to do your own maths and conversions.'
      });
      val = parseInt(val);
    }
    return val;
  };

  _.forEach(trans, function (val) {
    if (_.has(matrixObj, val)) {
      if (_.isArray(matrixObj[val])) {
        const objVals = _.reduce(matrixObj[val], function (prv, _val, _key) {
          prv[_key] = sanitize(_val);
          return prv;
        }, []);
        matrix[val](...objVals);
      }else {
        matrix[val](sanitize(matrixObj[val]));
      }
    }
  });

  //get the resulting matrix, and set
  staticArgs = staticArgs.set('transform', matrix.getMatrixCSS());

  return staticArgs;
};

module.exports = returnMatrix;

