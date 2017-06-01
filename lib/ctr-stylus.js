const _          = require('lodash');
const path       = require('path');
const styl       = require('stylus');
const CTR        = require('./ctr-js.js');
const config     = require('./ctr-config.js');
const throwErr   = require('./ctr-nodes/helpers/helper-throw-err.js');
const convert    = require('./ctr-nodes/convert/convert-index.js');
const Nodes      = styl.nodes;

/**
 * Processes the stylus data by convertiting it to a js objcect and sending
 * it off to be complied by ctr
 * @param  {obj} options.self      -> Stylus ref from define
 * @param  {obj} options.ctr       -> the ctr instance
 * @param  {obj} options.args      -> Args for a CtrClass
 * @param  {obj} options.data      -> Stylus hash object
 */
const processStylus = function ({self, ctr, args, data}) {
  let selector = '';
  if (_.isString(args.val)) {
    //declarative assigning
    selector = args.val;
  }else {
    //imperative need to reasing data
    data = args;
    //gen selector
    selector = _.reduce(self.selectorStack, function (str, val) {
      if (str !== false) {
        val = val[0];
        val = val.val ? val.val : false;
        if (val === false) {
          return false;
        }
        str += ' ' + val;
      }
      return str;
    }, '');

    if (selector === false) {
      const curBlockNode = self.currentBlock.node;
      const blockSelctor = curBlockNode.nodes[0];
      throwErr({
        type: 'Imperative Selector Format',
        msg: `There was an issue building your imperative selector for ${blockSelctor}
              and there is not much I can do, I recommend you use the declarative
              ctr syntax. Since I cant build the selector, there will be no results.`
      });
    }else {
      //trim to remove any extra space on the selector
      selector = selector.trim();
    }
  }

  //conver data object
  data = convert.toJavascript(data);
  //options defined in stylus under the `$ctr_option` key
  let ctrOption = self.lookup('$ctr-option');
  //@dep -> look up old noation
  if (!ctrOption) {
    ctrOption = self.lookup('$ctr_option');
  }
  ctrOption = !ctrOption ? {} : convert.toJavascript(ctrOption);

  //create
  const res = ctr.create(selector, data, _.cloneDeep(ctrOption));
  //get and trim res
  return res.getRes().trim();
};


/**
 * Return the plugin callback for stylus.
 *
 * @return {Function}
 * @api public
 */
const ctrStylus = function (option = {}) {
  //Our global ctr instance
  //Allows us to set and use options as well as memozie the results
  const ctr = option.ctr ? option.ctr : new CTR();
  //need to omit so that we dont run into a circular dep issue with stylus
  option = _.omit(option, 'ctr');

  //check for js invocation
  const initArgs = [...arguments];
  if (option.JS !== true && initArgs.length > 1 && _.every(initArgs, (val) => !_.isUndefined(val))) {
    console.log('ERROR: Looks like your tying to use Javascript!!!');
    return;
  }

  //sends along rc option path if specifed
  const {rcGlobalOption} = config({rcPath: option.rcPath});
  //set init options
  option.implicit = option.implicit === false ? false : true;
  //default options for stylus ctr
  const defaultOptions = {
    variableUpdate: true,
    privateVariable: true,
    propertyVariable: true,
    _localVarPlugin_: true
  };
  option = _.defaultsDeep(option, rcGlobalOption, defaultOptions);

  //set options in our global ctr instance
  ctr.setOption(option);

  //we return a thunk so that we can do some stylus magice
  return function(style) {
    //init stylus ref inclueds
    style.include(path.resolve(__dirname));

    //pretty damn important, imports the ctr.styl template rules
    //without this ctr does not work. style.import === @import
    if (option.implicit) {
      style.import('ctr');
    }

    //inits the ctr proccesing from a ctr instance and class
    const initCtr = function (args, data) {
      const self = this;
      //cross our fingers, say a prayer, and hope dat stylus is processed
      const res = processStylus({self, ctr, args, data});
      // need to create a node literal to return css
      return new Nodes.Literal(res);
    };

    /*
    Stylus define vars
     */
    //ctr
    style.define('ctr', function (args, data) {
      return initCtr.apply(this, [args, data]);
    });
    //ctr-class
    style.define('CtrClass', function (args) {
      const self = this;
      //set class ref name
      const node = self.root.nodes[self.root.index];
      //convert classData
      const classData = convert.toJavascript(args);
      const className = node.toString();
      ctr.setClass(className, classData);
      return new Nodes.String(className);
    });
    //ctr-class
    style.define('ctrSetClass', function (className, classData) {
      //convert
      className = convert.toJavascript(className);
      classData = convert.toJavascript(classData);
      ctr.setClass(className, classData);
    });
    //alias of ctrSetClass -> props dep future
    style.define('ctrAddClass', function (className, classData) {
      //convert
      className = convert.toJavascript(className);
      classData = convert.toJavascript(classData);
      ctr.setClass(className, classData);
    });

     /**
      * Wrapper for settting ctr vars
      * @param {obj} data -> vars data
      * @param {obj} opt  -> option data
      */
    const setVar = function (data, opt) {
      //convert
      data = convert.toJavascript(data);
      opt = !opt || opt.isNull ? {} : convert.toJavascript(opt);
      //set
      ctr.setVar(data, opt);
    };
    //set varibles
    style.define('$$', setVar);
    style.define('ctrSetVar', setVar);
    style.define('ctrSetVariable', setVar);

    //set option
    style.define('ctrSetOption', function (data, opt) {
      //convert
      data = convert.toJavascript(data);
      opt = !opt || opt.isNull ? {} : convert.toJavascript(opt);
      //set
      ctr.setOption(data, opt);
    });

    /**
     * Wrap for setReset
     * @param {---} reset -> bln or defaults obj
     */
    const setReset = function (reset) {
      //convert
      reset = !reset || reset.isNull ? false : convert.toJavascript(reset);
      //set
      ctr.setReset(reset);
      //set back defaults
      ctr.setOption(defaultOptions);
    };
    //set reset
    style.define('ctrSetReset', function (reset) {
      setReset(reset);
    });
    //set reset alias
    style.define('ctrDevelopment', function (reset) {
      setReset(reset);
    });

    //ctr full reset
    style.define('ctrReset', function (reset) {
      //convert
      reset = !reset || reset.isNull ? false : convert.toJavascript(reset);
      //set
      ctr.reset(reset);
      //set back defaults
      ctr.setOption(defaultOptions);
    });
  };
};

module.exports =  ctrStylus;
