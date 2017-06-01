const _    = require('lodash');
const path = require('path');

/**
 * Processes and reads yaml files
 * @param  {---}  file        -> string path || buffer
 * @param  {str}  selector    -> defined selector
 * @param  {obj}  option      -> yaml optiosn && ctr options
 * @param  {fnc}  transformFn -> transform yaml fn
 * @return {ref}               -> ctr this ref
 */
const yaml = function (file, selector = '__yaml__', option = {}, transformFn = false) {
  const self = this;
  self._resetSet();

  //reasing args if needed
  if (_.isPlainObject(selector)) {
    transformFn = _.isFunction(transformFn) ? option : transformFn;
    option = selector;
    selector = '__yaml__';
  }else if (_.isFunction(selector)) {
    transformFn = selector;
    selector = '__yaml__';
  }

  //pull out ctr option if specified
  //@note, probs deprecating $ctr-option in favor of ctrSetOption
  let ctrOption = option.option || option['$ctr-option'];
  ctrOption = _.isPlainObject(ctrOption) ? ctrOption : option;

  /**
   * Processes yaml file
   * @param  {---}  filePath -> str path || buffer of yaml file
   * @param  {bln} buffer    -> if we are working with a buffer
   * @return {ref}           -> ctr this ref
   */
  const processYaml = function (filePath, buffer = false) {
    const requireWatch = _.get(option, 'requireWatch') || self.globalOption.get('requireWatch');
    //if requireWatch is present we need to add the filepath to it so its watched
    if (requireWatch) {
      if (_.isFunction(requireWatch)) {
        //pass along options to loader
        requireWatch(filePath, option);
      }else {
        //throw err
        const type = typeof option.requireWatch;
        self._throwErr({
          error: 'Format',
          msg: `The "requireWatch" must be a function but I got a: ${type}.
                This means that your file is not being watched!`
        });
      }
    }

    //parser
    let data = self._parseYaml(filePath, buffer, option);
    //safty catch, if call prase failed return
    if (data === false) {
      self.error = {
        error: 'YAML parser',
        msg: `YAML parser location: ${filePath}`
      };
      self._throwErr(self.error);
      return self;
    }
    //need to set here, otherwise it will keep throwing old yaml parser erros
    self.error = false;

    //check transforms
    if (_.isFunction(transformFn)) {
      data = transformFn.call(self, data);
    }
    const transform = option.transform || option.yamlTransform;
    //if transform is present throw the data through the funk
    if (_.isFunction(transform)) {
      data = transform.call(self, data);
    }
    //setYamlTransform check
    if (self.yamlTransform.length) {
      data = self._transformYamlData(data);
    }

    //check for class data
    if (option.setClass || option.addClass) {
      return self.setClass(data, false, option);
    }

    //if selector is specified config right aways since no globals
    if (selector !== '__yaml__') {
      return self.create(selector, data, ctrOption);
    }

    //send off to config data when then invokes configYaml
    const create = _.partial(self.create, _, _, ctrOption);
    return self._objectProcess(data, create);
  };


  /**
   * Finds and checks file paths before they are sent to be processed
   * @param  {str} _file -> file path
   * @return {---}       -> this ref
   */
  const findFile = function (_file) {
    let filePath;
    let errMsg;
    let fileFound = false;

    //look up relative first if defined in option
    if (option.relative || option.relativePath) {
      filePath = path.join(
        self._getCallerFile().replace(/\/([^\/]+)\/?$/, ''),
        _file
      );
      //check to verify path
      if (self._h.fileExists(filePath)) {
        return processYaml(filePath);
      }
    }

    //no path assumtion
    let callerFile;
    if (_.isUndefined(_file) || _file === true) {
      callerFile = self._getCallerFile();
      filePath = self._h.fileExists(callerFile.replace('.js', '.yml'))
               ? callerFile.replace('.js', '.yml')
               : self._h.fileExists(callerFile.replace('.js', '.yaml'))
               ? callerFile.replace('.js', '.yaml')
               : false;
      errMsg = `You did not include a YAML path I looked in the ${callerFile}
                directory but alas no dice. Please try a specified path.`;
    }else {
      //path find
      filePath = self._h.fileExists(_file)
               ? _file
               : self._h.fileExists('.' + _file)
               ? '.' + _file
               : false;
    }

    //if false give the relative path a shot
    if (!filePath) {
      filePath = path.join(
        self._getCallerFile().replace(/\/([^\/]+)\/?$/, ''),
        _file
      );
      fileFound = self._h.fileExists(filePath);
    }else {
      fileFound = true;
    }

    //throw error file not found
    if (!fileFound) {
      self.error = {
        error: 'YAML file not found',
        msg: errMsg || 'I looked but I could just not find: ' + _file
      };
      self._throwErr(self.error);
      return self;
    }

    return processYaml(filePath);
  };

  //check file type and process accordingly
  if (_.isString(file)) {
    return findFile(file);
  }else if (_.isArray(file)) {
    //array loop and call
    for (let i = 0; i < file.length; i++) {
      //set original file path
      findFile(file[i]);
    }
    return self;
  }else if (_.isBuffer(file)) {
    return processYaml(file, true);
  }else if (_.isUndefined(file) || file === true) {
    //no path assumption
    return findFile(file);
  }

  const fileType = typeof file;
  self.error = {
    error: 'Format',
    msg: `The yaml method only processes, string paths, an array of string paths, or a buffer.
          Alas, the format you imputed was a: ${fileType}.`
  };
  self._throwErr(self.error);
  return self;
};

module.exports = yaml;
