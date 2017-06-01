const Immutable          = require('immutable');
const rcConfig           = require('./ctr-config.js');
const _dataConfig        = require('./ctr-js-nodes/_data-config.js');
const _helpers           = require('./ctr-js-nodes/_helpers.js');
const _dataProcess       = require('./ctr-js-nodes/_data-process.js');
const _getCallerFile     = require('./ctr-js-nodes/_get-caller-file.js');
const _objectProcess     = require('./ctr-js-nodes/_object-process.js');
const _objectReplace     = require('./ctr-js-nodes/_object-replace.js');
const _extendReplace     = require('./ctr-js-nodes/_extend-replace.js');
const _parseYaml         = require('./ctr-js-nodes/_parse-yaml.js');
const _render            = require('./ctr-js-nodes/_render.js');
const _resSetAdd         = require('./ctr-js-nodes/_res-set-add.js');
const _resetSet          = require('./ctr-js-nodes/_reset-set.js');
const _throwErr          = require('./ctr-js-nodes/_throw-err.js');
const _transformData     = require('./ctr-js-nodes/_transform-data.js');
const _transformYamlData = require('./ctr-js-nodes/_transform-yaml-data.js');
const yaml               = require('./ctr-js-nodes/yaml.js');
const writeFile          = require('./ctr-js-nodes/write-file.js');
const setYamlTransform   = require('./ctr-js-nodes/set-yaml-transform.js');
const setVariable        = require('./ctr-js-nodes/set-variable.js');
const setTransform       = require('./ctr-js-nodes/set-transform.js');
const reset              = require('./ctr-js-nodes/reset.js');
const setReset           = require('./ctr-js-nodes/set-reset.js');
const setOption          = require('./ctr-js-nodes/set-option.js');
const setClass           = require('./ctr-js-nodes/set-class.js');
const setCallback        = require('./ctr-js-nodes/set-callback.js');
const getResult          = require('./ctr-js-nodes/get-result.js');
const getLastResult      = require('./ctr-js-nodes/get-last-result.js');
const create             = require('./ctr-js-nodes/create.js');


/*
The
              .                           oooo
            .o8                           `888
 .ooooo.  .o888oo oooo d8b       .ooooo.   888   .oooo.    .oooo.o  .oooo.o
d88' `"Y8   888   `888""8P      d88' `"Y8  888  `P  )88b  d88(  "8 d88(  "8
888         888    888          888        888   .oP"888  `"Y88b.  `"Y88b.
888   .o8   888 .  888          888   .o8  888  d8(  888  o.  )88b o.  )88b
`Y8bod8P'   "888" d888b         `Y8bod8P' o888o `Y888""8o 8""888P' 8""888P'
 */


/**
 * This class is our point man for the js api. All data runs through this class
 * including all stylus ctr stlyes. All public/private methods are located in
 * /ctr-js-nodes, and for the most part everything should be pretty striaght
 * foward. Here is the gits of the pipeline:
   1. data comes in through create, internal class state vars get reset/reconfiged
      need be, by way of _resetSet and then data is handed off to _render
   2. _render is the primary manager of sorts, in that it dispatches the data
      to the various config opperations to prep/format the data for ctr-nodes.
      Most the action/manipulation occurs when _render throws the data over
      to _dataConfig. In a nutshell, the options, variables, classes, are configed
      here via _objectReplace, _extendReplace, and friends.
   3. After the data is configured _dataProcess takes on over and sets up the
      Stylus tango dance sending the data off to ./ctr-nodes which is a
      black box of twisted magic wrapped in youthful convoluted tomfoolery, most
      of which needs to be re-writen. Nevertheless, fingers crossed, the data
      is converted into proper CSS and returned in our pseudo render cb
   4. From here the cb simply slings our now, CSS over to _resSetAdd, which
      adds the CSS to resultSet and resultDbMap.
   5. The CSS then patiently waits to be called upon to inject dream-making
      possibilities upon the DOM in hopes of greatness
   6. Profit.
 */
class CTR {

  /**
   * Constructor for ctr, can be called with or without new
   * @param  {obj} instanceOption -> rc options for ctr instance
   */
  constructor (instanceOption) {
    const self = this;
    //dem arguments
    self.args = [...arguments];
    //results will be pushed into this Set
    self.resultSet = new Set();
    //results will be stroed in this map
    self.resultDbMap = new Map();
    //stores classes added via setClass
    self.ctrClass = Immutable.Map();
    //stores raw classes for comparisions
    self._ctrClassRaw = Immutable.Map();
    //stores the key to be used to set map on render result
    self.resultKey = null;
    //keys for the current set being processed
    self.resultKeySet = [];
    //inst option, need to keep in case rc runs again
    self.instanceOption = instanceOption;
    //config check of ctrrc
    const {
      rcVars,
      rcMtime,
      rcFilePath,
      rcGlobalOption
    } = rcConfig.call(self, {instanceOption});
    //store rc's as private
    self._rcVars = Immutable.fromJS(rcVars);
    self._rcGlobalOption = Immutable.fromJS(rcGlobalOption);
    self._rcFilePath = rcFilePath || null;
    self._rcMtime = rcMtime || null;
    self._rcUserPath = null;
    //global vars
    //inherit default from rc
    self.vars = self._rcVars;
    //global option to be merged with every render
    //inherit default from rc
    self.globalOption = self._rcGlobalOption;
    //error saftey catch
    self.error = false;
    //stylus render error
    self.stylusError = false;
    //current result
    self.res = '';
    //callback to invoke upon render
    self.callback = false;
    //transform function array
    self.transform = [];
    //yam transform function array
    self.yamlTransform = [];
    //if init style has been renered
    self.rendered = false;
    //local var key, this option is for the folks
    //who feel dirty about using a $$ key
    self.localVarKey = '$$';
    self._rcConfigRan = false;
    //saftey for obj replace so we don't run into a infy loop
    self._infyLoopCount = 5000;
    //selector ref for error location
    self._selector = '';


    /**
     * Private
     */
    // (selector, data, option = {}) -> pre data prepper
    self._dataConfig        = _dataConfig;
    // (selector, data, option = {}, cb) ->  main man sends data through ctr-nodes
    self._dataProcess       = _dataProcess;
    // (source) -> extend matching/replace
    self._extendReplace     = _extendReplace;
    // () -> prepareStatckTrace for inst location
    self._getCallerFile     = _getCallerFile;
    // {fileExists, defaultsDeep, get, has} -> i get high with a little help from my friends
    self._h                 = _helpers;
    // (data, fn) -> process object data to and extracts globals and such
    self._objectProcess     = _objectProcess;
    // (_source, replacer, {privateReplacer = false, reportError = false, localVarUpdate = false} = {})
    // the magic maker that handles var replcament -> matching string patterns
    self._objectReplace     = _objectReplace;
    // (filePath, buffer = false, option = {}) -> wrapper for js-yaml load/read
    self._parseYaml         = _parseYaml;
    // (transformFn = false) -> inits the stylus render dance, passes to _dataProcess
    self._render            = _render;
    // (res, key = this.resultKey, cache = true) -> adds res to resultSet
    self._resSetAdd         = _resSetAdd;
    // (configOverride = false) -> interal reset before _render
    self._resetSet          = _resetSet;
    // ({error, msg, format = true}) -> console.error helper/reporter
    self._throwErr          = _throwErr;
    // (res) -> setTransform result fn's
    self._transformData     = _transformData;
    // (data) -> setYamlTransform fn's before _render
    self._transformYamlData = _transformYamlData;


    /**
     * Public
     */
    // (selector, data, option = {}, transformFn = false) -> main entry to create style
    self.create           = create;
    // (reset = false, raw = false) -> resets last set style
    self.getLastResult    = getLastResult;
    self.getLastResultSet = getLastResult;
    // (reset = true, raw = false) -> gets result of styles
    self.getRes           = getResult;
    self.getResult        = getResult;
    // (resetDefaults = false) -> total reset
    self.reset            = reset;
    // (cb, option = {}) -> sets render callback
    self.setCallback      = setCallback;
    // (className, classData = false, option = {}) -> sets class
    self.addClass         = setClass;
    self.setClass         = setClass;
    // (ctrOptions = {}, option = {}) -> sets options
    self.setOption        = setOption;
    // (resetDefaults = false) -> resets all sets
    self.development      = setReset;
    self.setReset         = setReset;
    // (transform, option = {reset: false, once: false}) -> sets transform
    self.setTransform     = setTransform;
    // (vars = {}, option = {}) -> sets variables
    self.setVar           = setVariable;
    self.setVariable      = setVariable;
    // (transformFn, option = {}) -> sets yaml specific transform
    self.setYamlTransform = setYamlTransform;
    // (filePath = false, option = {}) -> write out res
    self.writeFile        = writeFile;
    // (file, selector = '__yaml__', option = {}, transformFn = false) -> process yaml
    self.yaml             = yaml;
  }
}

module.exports = CTR;
