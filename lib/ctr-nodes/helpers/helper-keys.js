const _           = require('lodash');
const Immutable   = require('immutable');
const editMod     = require('./helper-edit.js');
const clearfixMod = require('./helper-clearfix.js');
const responsiveT = require('./helper-responsive-type.js');
const alignS      = require('./helper-align-self.js');
const matrix      = require('./helper-matrix.js');
const filter      = require('./helper-filter.js');


const helperKeys = {
  edit: function (staticArgs, target) {
    return editMod(staticArgs, target);
  },
  clearfix: function (staticArgs, target) {
    return clearfixMod(staticArgs, target);
  },
  filter: function (staticArgs, objectArgs) {
    return filter(staticArgs, objectArgs);
  },


  /**
   * Sizer helper for width height
   * @param  {map} staticArgs -> args
   * @return {map}
   */
  size: function (staticArgs) {
    //size ===> height == size + width == size
    let size = staticArgs.get('size');
    size = size.toJS ? size.toJS() : size;
    staticArgs = staticArgs.delete('size');
    if (_.isArray(size)) {
      // arr w, h
      staticArgs = staticArgs.set('width', size[0]);
      staticArgs = staticArgs.set('height', size[1]);
    }else {
      // single arg
      staticArgs = staticArgs.set('height', size);
      staticArgs = staticArgs.set('width', size);
    }
    return staticArgs;
  },

  /**
   * Position helper
   * @param  {map} staticArgs -> args
   * @return {map}
   */
  position: function (staticArgs) {
    //position key
    //position: [type] [top] [right] [bottom] [left];

    //get position
    let position = staticArgs.get('position');
    position = position.toJS ? position.toJS() : position;

    const setter = function (pos, val) {
      return !staticArgs.has(pos) ? staticArgs.set(pos, val) : staticArgs;
    };

    if (_.isArray(position) && position.length > 1) {
      //delete and set
      staticArgs = staticArgs.delete('position');
      staticArgs = staticArgs.set('position', position[0]);
      if (position.length === 2) {
        //position: [type] [1] [1] [1] [1]
        staticArgs = setter('top', position[1]);
        staticArgs = setter('bottom', position[1]);
        staticArgs = setter('right', position[1]);
        staticArgs = setter('left', position[1]);
      }else if (position.length === 3) {
        //position: [type] [1] [2] [1] [2]
        staticArgs = setter('top', position[1]);
        staticArgs = setter('bottom', position[1]);
        staticArgs = setter('right', position[2]);
        staticArgs = setter('left', position[2]);
      }else if (position.length === 4) {
        //position: [type] [1] [2] [3] [2]
        staticArgs = setter('top', position[1]);
        staticArgs = setter('bottom', position[3]);
        staticArgs = setter('right', position[2]);
        staticArgs = setter('left', position[2]);
      }else if (position.length === 5) {
        //position: [type] [1] [2] [3] [4]
        staticArgs = setter('top', position[1]);
        staticArgs = setter('right', position[2]);
        staticArgs = setter('bottom', position[3]);
        staticArgs = setter('left', position[4]);
      }
    }

    return staticArgs;
  },

  responsiveSize: function (staticArgs, target, key) {
    staticArgs =  responsiveT.create(staticArgs, target, key);
    return staticArgs;
  },

  alignSelf: function (staticArgs) {
    let loc;

    //get local and update static args
    if (staticArgs.has('alignSelf')) {
      loc = staticArgs.get('alignSelf');
      staticArgs = staticArgs.remove('alignSelf');
    }else {
      loc = staticArgs.get('align');
      staticArgs = staticArgs.remove('align');
    }

    //send off to be processed
    staticArgs = alignS(staticArgs, loc);

    return staticArgs;
  },

  /**
   * Takes a transform object and composes as a trasform string
   * Called directly from the index
   * @param  {map} staticArgs   -> args
   * @param  {obj} transformObj -> trans form obj
   * @return {map}              -> staticArgs
   */
  // transform: function (staticArgs, transformObj) {
  transform: function (objectArgs, staticArgs = false) {
    //check if trasform is an object
    let trans = objectArgs.get('transform');
    trans = trans.toJS ? trans.toJS() : trans;
    //short if not object val
    if (!_.isPlainObject(trans)) {
      return {
        objectArgs,
        staticArgs
      };
    }
    const hasStaticArgs = staticArgs;
    //reasing if no staticArgs
    staticArgs = staticArgs ? staticArgs : Immutable.Map();
    //convert transform object
    trans = _.reduce(trans, function (prv, val, key) {
      prv += ' ' + key + '(' + val + ')';
      return prv;
    }, '');

    //set result
    if (hasStaticArgs) {
      //set
      staticArgs = staticArgs.set('transform', trans);
      //remove
      objectArgs = objectArgs.remove('transform');
    }else {
      objectArgs = objectArgs.set('transform', trans);
    }

    return {
      objectArgs,
      staticArgs
    };
  },

  /**
   * Creates a matrix3d from values
   * @param  {map} objectArgs
   * @param  {map} staticArgs
   * @return {map}
   */
  matrix: function (objectArgs, staticArgs = false) {
    const hasStaticArgs = staticArgs;
    //reasing if no staticArgs
    staticArgs = staticArgs ? staticArgs : Immutable.Map();

    //get martix
    let matrixObj = objectArgs.get('matrix');
    matrixObj = matrixObj.toJS ? matrixObj.toJS() : matrixObj;

    if (matrixObj) {
      //remove from object
      objectArgs = objectArgs.remove('matrix');
      //send off to be processed
      staticArgs = matrix(
        matrixObj,
        staticArgs
      );
      // assing object args depending on imut or typical obj
      objectArgs = hasStaticArgs ? objectArgs
                                 // if immutatble
                                 : objectArgs.merge(staticArgs);
    }

    return {
      objectArgs,
      staticArgs
    };
  },

  /**
   * Checks static args for helper values
   */
  processHelperArgs: function (staticArgs, target) {
    const self = this;

    const keyLink = {
      edit: self.edit,
      clearfix: self.clearfix,
      size: self.size,
      position: self.position,
      'font-size': self.responsiveSize,
      'line-height': self.responsiveSize,
      'letter-spacing': self.responsiveSize,
      alignSelf: self.alignSelf,
      align: self.alignSelf
    };

    //cylce to check if it has key
    staticArgs.forEach(function (val, key) {
      if (_.has(keyLink, key)) {
        //process helper
        staticArgs = keyLink[key](staticArgs, target, key);
      }
    });

    return staticArgs;
  }
};



module.exports = helperKeys;
