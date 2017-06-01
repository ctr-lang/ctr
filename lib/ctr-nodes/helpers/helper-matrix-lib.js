const defclass = require('defclass');

/**
 * Meh, I'm kind-of confident about the maths, at least, for single transforms.
 * Although, when it comes to mutiple transforms - I'm a bit unsure if the proper
 * calculations are made. Like I said in the docs, I'm no maths wizard, but
 * in the future I plan on digging into css martix a bit more and come back
 * to this problem because there is a lot of potentail for creating some cool
 * fuckin shit to make the crowd go - WOW!
 */


/**
 * Helper functions for Transformer
 * Ported from: github.com/bcherny/transform-to-matrix/blob/master/transform-to-matrix.js
 */
const Compute = {
  perspective: function(d) {
    return [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, -1 / d, 1]
    ];
  },

  rotate: function(a) {
    return Compute.rotateZ(a);
  },

  rotateX: function(a) {
    return Compute.rotate3d(1, 0, 0, a);
  },

  rotateY: function(a) {
    return Compute.rotate3d(0, 1, 0, a);
  },

  rotateZ: function(a) {
    const c = Math.cos(a);
    const n = Math.sin(a);
    return [
      [c, -n, 0],
      [n, c, 0]
    ];
  },

  rotate3d: function(x, y, z, a) {
    const s = x * x + y * y + z * z;
    const c = Math.cos(a);
    const n = Math.sin(a);
    const i = 1 - c;
    const rs = Math.sqrt(s) * n;
    return [
      [(x * x + (y * y + z * z) * c) / s, (x * y * i - z * rs) / s, (x * z * i + y * rs) / s, 0],
      [(x * y * i + z * rs) / s, (y * y + (x * x + z * z) * c) / s, (y * z * i - x * rs) / s, 0],
      [(x * z * i - y * rs) / s, (y * z * i + x * rs) / s, (z * z + (x * x + y * y) * c) / s, 0],
      [0, 0, 0, 1]
    ];
  },

  scale: function(x, y) {
    return [
      [x, 0, 0],
      [0, y, 0]
    ];
  },

  scaleX: function(x) {
    return Compute.scale(x, 1);
  },

  scaleY: function(y) {
    return Compute.scale(1, y);
  },

  scaleZ: function(z) {
    return Compute.scale3d(1, 1, z);
  },

  scale3d: function(x, y, z) {
    return [
      [x, 0, 0, 0],
      [0, y, 0, 0],
      [0, 0, z, 0],
      [0, 0, 0, 1]
    ];
  },

  skew: function(x, y) {
    return [
      [1, Math.tan(x), 0],
      [Math.tan(y), 1, 0]
    ];
  },

  skewX: function(x) {
    return [
      [1, Math.tan(x), 0],
      [0, 1, 0]
    ];
  },

  skewY: function(y) {
    return [
      [1, 0, 0],
      [Math.tan(y), 1, 0]
    ];
  },

  translate: function(x, y) {
    return [
      [1, 0, x],
      [0, 1, y]
    ];
  },

  translateX: function(x) {
    return Compute.translate(x, 0);
  },

  translateY: function(y) {
    return Compute.translate(0, y);
  },

  translateZ: function(z) {
    return Compute.translate3d(0, 0, z);
  },

  translate3d: function(x, y, z) {
    return [
      [1, 0, 0, x],
      [0, 1, 0, y],
      [0, 0, 1, z],
      [0, 0, 0, 1]
    ];
  },

  /**
   * convert strings like "55deg" or ".75rad" to floats (in radians)
   * @param  {str} str -> string to compute rad from
   * @return {str}     -> rad' man
   */
  getRad: function (str) {
    if (typeof str === 'string') {
      let angle     = parseFloat(str, 10);
      const isDegrees = str.includes('deg');
      // convert to degs
      if (isDegrees) {
        angle *= Math.PI / 180;
      }
      //otherwise assume rad
      return angle.toFixed(5);
    }
    return str;
  }
};




const Transformer = defclass({
  constructor: function (data) {
    const self = this;
    this.matrix = self.identity();
    if (data) {
      this.setMatrix(data);
    }
  },

  /**
   * get matrix formatted as a string that can be plugged right into CSS's `transform` function
   * @return {str} -> matrix3d magix
   */
  getMatrixCSS: function() {
    const self = this;
    /**
     * Wrapper to slice off some decimals since toFixed does not round properly
     * @param  {num} num      -> number to "fix" - round
     * @param  {num} decimals -> decimal place
     * @return {str}
     */
    const preciseRound = function (num, decimals = 8) {
      const sign = num >= 0 ? 1 : -1;
      const fixed = (Math.round((num * Math.pow(10, decimals)) + (sign * 0.001)) / Math.pow(10, decimals)).toFixed(decimals);
      return Number.parseFloat(fixed);
    };
    /**
     * Wrapper to map over arr and "fix" the values
     * @param  {arr} arr -> array to fix
     * @return {arr}
     */
    const toFixed = function (arr) {
      return arr.map((val) => preciseRound(val));
    };
    return 'matrix3d(' +
      self.flip(this.getMatrixCopy()).reduce(function (flat, row) {
        flat.push.apply(flat, row);
        return toFixed(flat);
      }, []).join(',') + ')';
  },

  /**
   * sets matrix in model
   * @param {obj} data -> data to set
   */
  setMatrix: function (data) {
    const self = this;

    if (data.length === 3) {
      data[0].push(0);
      data[1].push(0);
      data[2].push(0);
      data[3] = [0, 0, 0, 1];
    }
    self.matrix = self.merge(self.matrix, data);
    return self;
  },

  /**
   * Reset identity or create new one
   * @param  {arr} matrix
   * @return {arr}
   */
  identity: function(matrix) {
    if (!matrix) {
      return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
      ];
    }

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (r === c) {
          matrix[r][c] = 1;
        } else {
          matrix[r][c] = 0;
        }
      }
    }
    return matrix;
  },

  /**
   * apply transformations as defined in the model,
   * and get back get calculated matrix
   * @return {arr}
   */
  getMatrixCopy: function() {
    const matrix = this.matrix;
    const newMatrix = [];
    for (let r = 0; r < matrix.length; r++) {
      newMatrix[r] = [];
      for (let c = 0; c < matrix[r].length; c++) {
        newMatrix[r][c] = matrix[r][c] || 0;
      }
    }
    return newMatrix;
  },

  /**
   * Merges martix
   * @param  {arr} base    -> base matrix
   * @param  {arr} toMerge -> merge martix
   * @return {arr}
   */
  merge: function(base, toMerge) {
    for (let r = 0; r < base.length; r++) {
      for (let c = 0; c < base[r].length; c++) {
        base[r][c] = toMerge[r][c] || 0;
      }
    }
    return base;
  },

  /**
   * Multiplex martix(s)
   * @param  {arr} base       -> base martix
   * @param  {arr} toMultiply -> multiplier matrix
   * @return {arr}
   */
  multiply: function(base, toMultiply) {
    const result = [];
    const size = toMultiply.length;
    for (let r = 0; r < size; r++) {
      const row = toMultiply[r];
      for (let c = 0; c < row.length; c++) {
        let l = size;
        let sum = 0;
        while (l--) {
          sum += base[r][l] * toMultiply[l][c];
        }
        result.push(sum);
      }
    }

    let l = 0;
    for (let r = 0; r < base.length; r++) {
      for (let c = 0; c < base[r].length; c++) {
        base[r][c] = result[l];
        l++;
      }
    }
    result.length = 0;

    return base;
  },

  /**
   * Filps the martix for proppert format of matrix3d
   * @param  {arr} matrix -> source martix
   * @return {arr}
   */
  flip: function(matrix) {
    const result = [];
    const len = matrix.length;

    for (let r = 0; r < len; r++) {
      const row = matrix[r];
      for (let c = 0; c < len; c++) {
        const value = row[c];
        (result[c] || (result[c] = []))[r] = value;
      }
    }
    return result;
  },

  /**
   * Gen 2d matrix
   * @param  {arr} matrix -> source martix
   * @return {arr}
   */
  to2d: function(matrix) {
    return [
      [matrix[0][0] || 1, matrix[0][1] || 0, matrix[0][3] || 0],
      [matrix[1][0] || 0, matrix[1][1] || 1, matrix[1][3] || 0]
    ];
  },

  /**
   * Gen 3d matrix
   * @param  {arr} matrix -> source martix
   * @return {arr}
   */
  to3d: function(matrix) {
    return [
      [matrix[0][0] || 1, matrix[0][1] || 0, 0, matrix[0][2] || 0],
      [matrix[1][0] || 0, matrix[1][1] || 1, 0, matrix[1][2] || 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  },


  //////////////////////////////////////////////////////////////////////////////
  // transform functions
  // 1-to-1 with their CSS equivalents
  //////////////////////////////////////////////////////////////////////////////
  rotate: function (a) {
    return this.rotateZ(a);
  },
  rotateX: function (a) {
    return this.rotate3d(1, 0, 0, a);
  },
  rotateY: function (a) {
    return this.rotate3d(0, 1, 0, a);
  },
  rotateZ: function (a) {
    return this.rotate3d(0, 0, 1, a);
  },
  scale: function (x, y) {
    return this.scale3d(x, y);
  },
  scaleX: function (x) {
    return this.scale3d(x);
  },
  scaleY: function (y) {
    return this.scale3d(null, y);
  },
  scaleZ: function (z) {
    return this.scale3d(null, null, z);
  },
  skewX: function (x) {
    return this.skew(x);
  },
  skewY: function (y) {
    return this.skew(null, y);
  },
  translate: function (x, y) {
    return this.translate3d(x, y);
  },
  translateX: function (x) {
    return this.translate3d(x);
  },
  translateY: function (y) {
    return this.translate3d(null, y);
  },
  translateZ: function (z) {
    return this.translate3d(null, null, z);
  },
  perspective: function (x) {
    const self = this;
    if (!x) {
      x = 0;
    }

    self.multiply(
      this.matrix,
      Compute.perspective(x)
    );

    return self;
  },
  rotate3d: function (x, y, z, a) {
    const self = this;
    if (!x) {
      x = 0;
    }
    if (!y) {
      y = 0;
    }
    if (!z) {
      z = 0;
    }
    if (!a) {
      a = 0;
    }

    self.multiply(
      self.matrix,
      Compute.rotate3d(
        x,
        y,
        z,
        Compute.getRad(a)
      )
    );

    return self;
  },
  scale3d: function (x, y, z) {
    const self = this;
    if (!x && x !== 0) {
      x = 1;
    }
    if (!y && y !== 0) {
      y = 1;
    }
    if (!z && z !== 0) {
      z = 1;
    }

    self.multiply(
      this.matrix,
      Compute.scale3d(x, y, z)
    );

    return self;
  },
  skew: function (x, y) {
    const self = this;
    if (!x) {
      x = 0;
    }
    if (!y) {
      y = 0;
    }

    self.multiply(
      self.matrix,
      self.to3d(
        Compute.skew(
          Compute.getRad(x),
          Compute.getRad(y)
        )
      )
    );

    return self;
  },
  translate3d: function(x, y, z) {
    const self = this;
    if (!x) {
      x = 0;
    }
    if (!y) {
      y = 0;
    }
    if (!z) {
      z = 0;
    }
    self.multiply(
      self.matrix,
      Compute.translate3d(x, y, z)
    );
    return self;
  }
});



module.exports = Transformer;
