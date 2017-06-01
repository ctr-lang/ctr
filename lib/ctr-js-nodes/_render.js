const _ = require('lodash');

/**
* Initilizes the render process for the set data
* @param  {bln} transformFn -> Transform function
* @return {ref}             -> ctr this ref
*/
const _render = function (transformFn = false) {
  const self = this;
  const args = [...arguments];
  //error safty check, short if there is an error
  if (self.error) {
    self._throwErr(self.error);
    return self;
  }

  //safty check for infy loop
  if (!self.args.length && !args.length) {
    return self;
  }

  //check for object based data, if so process it through objProcess
  //to convert it into (selector, data, ...) arg, set in create
  if (args.length !== 1 && _.get(_.last(args), '__object__')) {
    const render = _.partial(self._render, transformFn, _, _, _.omit(_.last(args), '__object__'));
    return self._objectProcess(args[1], render);
  }

  //set init processes vars
  const {
    selector,
    data,
    option
  } = args.length === 1
    ? self._dataConfig()
    : self._dataConfig(..._.takeRight(args, 3));

  //error safty check, short if there is an error
  if (self.error) {
    self._throwErr(self.error);
    return self;
  }

  //check for transformFn
  if (_.isFunction(transformFn)) {
    self.setTransform(transformFn, {once: true});
  }

  let cb;
  //add callback in non provided
  if (!self.callback) {
    //default callback
    cb = function (err, res, style, memoized) {
      if (err) {
        self.stylusError = err;
        //throw err msg
        self._throwErr({
          error: 'Stylus Error',
          msg: err,
          format: false
        });
      }else {
        //check for sourcemap, if so add some beathing room
        res = !_.has(style, 'sourcemap') ? res : '\n' + res;
        //transform the data if present -> set via setTransform
        res = !self.transform.length || memoized ? res : self._transformData(res);
        //set resutl ref
        self.res = res;
        //set the res for the map, key is already and stored at this.resultKey
        //we only set the set-res if there is no ctr node error which is signled
        //via global._ctrNodeError_
        //-stylus error occure when there is something like a infy loop
        //-however, if there is an error, it will always signal an error (or it shuold)
        self._resSetAdd(res, self.resultKey, !global._ctrNodeError_);
      }
    };
  }else if (_.isFunction(self.callback)) {
    //binded in method
    cb = self.callback;
  }

  //process style
  self._dataProcess(selector, data, option, cb);

  //return ref
  return self;
};


module.exports = _render;
