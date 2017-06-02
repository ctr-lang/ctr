const _         = require('lodash');
const stylus    = require('./stylus.js');
const yaml      = require('js-yaml');
const CtrJS     = require('./ctr-js.js');
const ctrStylus = require('./ctr-stylus.js');
const throwErr  = require('./ctr-nodes/helpers/helper-throw-err.js');


/**
 * The ctr Less Plugin
 *
 * This plugin delivers ctr support in less, albeit, it's the not the
 * prettiest implementation, but at this point, it would be silly to spend
 * the time to roll out a Less specific lexer and parser.
 *
 * This plugin works on straight Regex matches, and I must admit my Regex skills
 * are sub-standard. For the most part, I haven't made any huge blunders,
 * but then again, how would I know? That being said if you're one of those
 * Regex wizards from the heavens and you spot a potential blunder or improvement
 * I'm all ears.
 */
class CtrLess {
  constructor (option) {
    const self = this;

    /**
     * syntax set up - if syntrax is not specified we use both
     */
    self.syntaxStylus = !_.isUndefined(option.syntaxStylus) ? option.syntaxStylus : true;
    self.syntaxYaml   = !_.isUndefined(option.syntaxYaml) ? option.syntaxYaml : true;

    /**
     * ctr specific options, more or less private optoins, not in
     * docs yet, but they are in tests, no need to really change
     * but you can investigate if you please
     */
    const defaultOptions = {
      variableUpdate: true,
      privateVariable: true,
      propertyVariable: true,
      _localVarPlugin_: true
    };
    self.option = _.defaultsDeep(option, defaultOptions);

    /**
     * Setup and init our ctr instances
     * ctrJS     === YAML_SYNTAX
     * ctrStylus === default syntax
     */
    const _ctrJS  = new CtrJS();
    _ctrJS.setOption(self.option);
    self.ctrJS = _ctrJS;
    self.ctrStylusOpt = _.defaultsDeep(_.cloneDeep(self.option), {ctr: self.ctrJS});
    self.ctrStylus = ctrStylus(self.ctrStylusOpt);

    /**
     * Less variable setup, used in - lessVariablesReplace & lessVariablesProcess
     */
    self.lessVariables      = true;
    self.variableMap        = self.lessVariables ? new Map() : null;
    self.regexLessVariables = {
      variabels: new RegExp(/^@.*?;/gm),
      varaibleVal: new RegExp(/:.*?;/),
      notVariables: new RegExp(/^@(import|plugin)\s/),
      escapeString: new RegExp(/[|\\{}()[\]^$+*?.]/g),
      nonWhite: new RegExp(/\S|\r|\n/)
    };


    /**
     * The Regex Magic
     */
    //ctr instance replace regex, our main man, replace match for process method
    self.regexCtrInstance = new RegExp(/ctr(\w+\(\)|[\s\S]*?}\))/g);

    //removes both styles of less comments, // & /**/
    self.regexComment = self.option.SYNTAX_YAML
                      //excludes special syntax_yaml comment
                      ? new RegExp(/(\/\*([\s\S]*?)\*\/)|(\/\/(?!\sSYNTAX_YAML)(.*)$)/gm)
                      : new RegExp(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm);
    //SYANTAX_YAML comment regex
    self.SYNTAX_YAML     = self.option.SYNTAX_YAML;
    self.regexSyntaxYaml = new RegExp(/\/\/\sSYNTAX_YAML/);

    //All the possible ctr fn declarations and their respected matches
    self.regexMatches = {
      ctrSetStyle: new RegExp(/ctr\(([\s\S]*?)}\)/m),
      ctrSetVariable: new RegExp(/ctrSetVariable\(([\s\S]*?)}\)/m),
      ctrSetVar: new RegExp(/ctrSetVar\(([\s\S]*?)}\)/m),
      ctrSetReset: new RegExp(/ctrSetReset\(([\s\S]*?)(\)|}\))/m),
      ctrSetOption: new RegExp(/ctrSetOption\(([\s\S]*?)}\)/m),
      ctrSetClass: new RegExp(/ctrSetClass\(([\s\S]*?)}\)/m),
      ctrAddClass: new RegExp(/ctrAddClass\(([\s\S]*?)}\)/m),
      ctrDevelopment: new RegExp(/ctrDevelopment\(([\s\S]*?)(\)|}\))/m),
      ctrReset: new RegExp(/ctrReset\(([\s\S]*?)(\)|}\))/m)
    };

    //Regex's for stripOption method
    self.regexOption = [
      new RegExp(/reset:(.*?)$/m),
      new RegExp(/false:(.*?)$/m),
      new RegExp(/once:(.*?)$/m),
      new RegExp(/ctrrc:(.*?)$/m),
      new RegExp(/overwrite:(.*?)$/m)
    ];

    //Regex's for stripStyle method
    self.regexStrip = {
      selectorReplace: new RegExp(/,(.*?){/),
      selectorMatch: new RegExp(/^(.*)$/m),
      selectorClean: new RegExp(/['"]+/g),
      dataReplace: new RegExp(/}\)$/)
    };

    //Regex's for propper striping/formating in stripStyle (passed in as arg)
    self.regexStripFn = {
      ctrSetStyle: new RegExp(/^ctr\((.*?){/),
      ctrAddClass: new RegExp(/^ctrAddClass\((.*?){/),
      ctrSetClass: new RegExp(/^ctrSetClass\((.*?){/),
      ctrDevelopment: new RegExp(/^ctrDevelopment\({/),
      ctrSetOption: new RegExp(/^ctrSetOption\({/),
      ctrSetVar: new RegExp(/^ctrSetVar\({/),
      ctrSetVariable: new RegExp(/^ctrSetVariable\({/),
      ctrSetReset: new RegExp(/^ctrSetReset\({/),
      ctrReset: new RegExp(/^ctrReset\({/)
    };
  }



  /**
   * ctr reset, and depending on args it resets all or sets data.
   * If regex passed we do a "soft" reset and reset the sets and option
   * otherwise `ctrReset` does a hard reset
   * @param  {str} str   -> Reset instance str regex match - the data
   * @param  {reg} regex -> Regex match for clean
   * @return {str}       -> Empty string, set/options reset
   */
  ctrReset (str, regex, slice = 8) {
    const self = this;
    //check to process stylus
    let useStylus = true;
    ({str, useStylus} = self.processStylusCheck(str));
    //process stylus syntax
    if (useStylus) {
      self.processStylus(str);
      return '';
    }

    //setup control flow vars
    const fullReset = !regex;
    regex = regex ? regex : self.regexStripFn.ctrReset;
    //clean/strip
    let {data} = self.stripStyle(str, regex, slice);
    data = data.length ? self.processYaml(data) : true;
    //reset dependent, only full reset on ctrReset
    if (!fullReset) {
      self.ctrJS.setReset(data);
      self.ctrJS.setOption(self.option);
    }else {
      self.ctrJS.reset(data);
      self.ctrJS.setOption(self.option);
    }
    return '';
  }
  /**
   * Alias wrapper for ctrReset
   */
  ctrDevelopment(str) {
    const self = this;
    return self.ctrReset(str, self.regexStripFn.ctrDevelopment, 14);
  }
  /**
   * Alias wrapper for ctrReset
   */
  ctrSetReset(str) {
    const self = this;
    return self.ctrReset(str, self.regexStripFn.ctrSetReset, 11);
  }



  /**
   * ctr class setter that sets the class data to be used via extend
   * @param  {str} str   -> Class instance str regex match - the data
   * @param  {reg} regex -> Regex match if invoked via bellow wrapper alias
   * @return {str}       -> Empty, data is stored in ctr instance
   */
  ctrSetClass (str, regex) {
    const self = this;
    //check to process stylus
    let useStylus = true;
    ({str, useStylus} = self.processStylusCheck(str));
    //process stylus syntax
    if (useStylus) {
      self.processStylus(str);
      return '';
    }

    //set regex if setClass
    regex = regex ? regex : self.regexStripFn.ctrSetClass;
    const {selector, data} = self.stripStyle(str, regex, 12);
    self.ctrJS.setClass(selector, self.processYaml(data));
    return '';
  }
  /**
   * Alias wrapper for ctrSetClass
   */
  ctrAddClass (str) {
    const self = this;
    return self.ctrSetClass(str, self.regexStripFn.ctrAddClass);
  }



  /**
   * ctr Option setter, whose options are global in nature
   * @param  {str} str -> Option instance str regex match - the data
   * @return {str}     -> Empty string, options set in ctr instance
   */
  ctrSetOption (str) {
    const self = this;
    //check to process stylus
    let useStylus = true;
    ({str, useStylus} = self.processStylusCheck(str));
    //process stylus syntax
    if (useStylus) {
      self.processStylus(str);
      //->
      return '';
    }

    //clean/strip
    let {data} = self.stripStyle(str, self.regexStripFn.ctrSetOption, 12);
    //extract and strip possible options
    let option = null;
    ({str, option} = self.stripOption(data));
    //reprocess data in case stripOptions in fact did strip and alter str
    data = self.processYaml(str);
    //set options depeding on what we are working with
    if (!_.isEmpty(data)) {
      self.ctrJS.setOption(data, option);
    }else {
      self.ctrJS.setOption(option);
    }
    //->
    return '';
  }



  /**
   * ctr variable setter that sets variabled to used in various ctr instance types
   * @param  {str} str   -> Variable instance str regex match - the data
   * @param  {reg} regex -> Regex match if invoked via bellow wrapper alias
   * @param  {num} slice -> Slice amount for proper stripping
   * @return {str}       -> Empty, data is stored in ctr instance
   */
  ctrSetVariable (str, regex, slice = 14) {
    const self = this;

    //check to process stylus
    let useStylus = true;
    ({str, useStylus} = self.processStylusCheck(str));
    //process stylus syntax
    if (useStylus) {
      self.processStylus(str);
      return '';
    }

    //set regex if ctrSetVariable
    regex = regex ? regex : self.regexStripFn.ctrSetVariable;
    //clean/strip
    let {data} = self.stripStyle(str, regex, slice);
    //extract and strip possible options
    let option = null;
    ({str, option} = self.stripOption(data));
    //reprocess data in case stripOptions in fact did strip and alter str
    data = self.processYaml(str);
    //set options depeding on what we are working with
    if (!_.isEmpty(data)) {
      self.ctrJS.setVariable(data, option);
    }else {
      self.ctrJS.setVariable(option);
    }
    //->
    return '';
  }
  /**
   * Alias wrapper for ctrSetVariable
   */
  ctrSetVar (str) {
    const self = this;
    return this.ctrSetVariable(str, self.regexStripFn.ctrSetVar, 9);
  }



  /**
   * Our main man, ctr(*) instance to create style
   * @param  {str} str -> instance str regex match - the data
   * @return {str}     -> resulting CSS, hopefully*
   */
  ctrSetStyle (str) {
    const self = this;
    //check to process stylus
    let useStylus = true;
    ({str, useStylus} = self.processStylusCheck(str));
    //process stylus syntax
    if (useStylus) {
      return self.processStylus(str);
    }

    //proccess yaml syntax
    const {selector, data} = self.stripStyle(str, self.regexStripFn.ctrSetStyle);
    const ctr = self.ctrJS.create(selector, data);
    return ctr.getResult();
  }



  /**
   * Process/matches all less variabels in str, and it allways replaces
   * regarless, but, you should really be using ctrVars if possible
   * @param  {str} str -> stylesheet str to search
   * @return {---}     -> no return sets vars in instance Map
   */
  lessVariablesProcess (str) {
    const self   = this;
    const regex  = self.regexLessVariables;

    /**
     * Finds and sets and less variables in the str into our global var Map
     */
    const matches = str.match(regex.variabels);
    if (!matches) { return; }
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      //make sure its not a plugin/import
      if (!regex.notVariables.test(match)) {
        let val = match.match(regex.varaibleVal);
        if (val) {
          val = val[0];
          //remove the `:` and `;` from var value
          val = val.slice(1).slice(0, -1);
          //trim up any white space
          val = val.trim();
          //get the key from the matche
          let key = match.substring(0, match.indexOf(':'));
          //trim up any white space
          key = key.trim();
          //escape string, just in case, we don't want that blood on our hands
          key = key.replace(regex.escapeString, '\\$&');
          //set in our map, with a regex key, what!
          self.variableMap.set(new RegExp(key, 'g'), val);
        }
      }
    }
  }



  /**
   * Replaces set Less varibles in ctr instances that where pull/set in
   * lessVariablesProcess, feels janky as fuck, but its raw and real
   * @param  {str} str -> ctr instance to replace any matching less variabels
   * @return {str}     -> ctr instance with replaced less varibales
   */
  lessVariablesReplace (str) {
    const self   = this;
    const regex  = self.regexLessVariables;

    /**
     * Check to make sure the var in question, that we want to replace
     * is not the variable declaration. Not sure if there's a better
     * way to do this, nonetheless, this way works. If the next char
     * in line is `:` excluding \s its a var declaration, and we don't process
     * @param  {num} index -> index to start da loop
     * @return {bln}       -> the truth
     */
    const checkIfVarDec = function (index, context) {
      let varDec = null;
      //Loop while I whistle
      while (varDec === null) {
        const char = context.charAt(index);
        if (char === ':') {
          varDec = true;
        }else if (char === ' ') {
          index++;
        }else if (regex.nonWhite.test(char)) {
          varDec = false;
        }else {
          varDec = false;
        }
      }
      return varDec;
    };

    /**
     * Cycle through variable map, test, and replace, and with
     * any luck things work as they should
     */
    self.variableMap.forEach(function (val, key) {
      str = str.replace(key, function (_str, index, context) {
        return checkIfVarDec(index + _str.length, context) ? _str : val;
      });
    });
    return str;
  }



  /**
   * Inital entry point of raw Less file to process. We cycle to match and
   * replace Regex'ed instances
   * @param  {str} str -> raw Less file
   * @return {str}     -> replaced ctr instanes with CSS or '' if only data set
   */
  process (str) {
    const self = this;
    //remove comments
    str = str.replace(self.regexComment, '');
    //if less variable option, find less vars and store in map
    if (self.lessVariables) {
      self.lessVariablesProcess(str);
    }

    /**
     * Match basic ctr(*) regex, and then in the fn we cycle through the
     * specific ctr* fn instances and upon matches we send off the match
     * to be processed/replaced
     * @param  {str} strRep -> String replace match
     * @return {str}        -> processed ctr, fingers crossed
     */
    const res = str.replace(self.regexCtrInstance, function (strRep) {
      //if less variables option, check to replace vars
      strRep = self.lessVariables && self.variableMap
             ? self.lessVariablesReplace(strRep) : strRep;
      //loop de loop
      for (const key in self.regexMatches) {
        if (self.regexMatches.hasOwnProperty(key)) {
          const regex = self.regexMatches[key];
          if (regex.test(strRep)) {
            return self[key](strRep);
          }
        }
      }
      //allways return just in case
      return strRep;
    });
    //->
    return res;
  }



  /**
   * Wrapper around ctrStylus to process the default ctr syntax, i.e, the
   * stylus syntax
   * @param  {str} str -> ctr instance to process/set
   * @return {str}     -> depending on data type either empty str or CSS
   */
  processStylus (str) {
    const self = this;
    let res = null;
    //no actually a "real" callback, ie, not async
    stylus(str).use(self.ctrStylus).render(function (err, _res) {
      if (err) {
        res = '';
        throwErr({
          type: 'ctr Less - Internal Error, Skipping...',
          msg: err,
          code: str
        });
      }
      res = _res;
    });
    //ensure return is a string
    return _.isString(res) ? res : '';
  }



  /**
   * Helper to check if we want to process as stylus, specifically we are
   * checking for the special SYNTAX_YAML option
   * @param  {str} str -> str to check against
   * @return {obj}     -> da outcome
   */
  processStylusCheck (str) {
    const self = this;
    //User specified not YAML syntax
    if (self.syntaxStylus && !self.SYNTAX_YAML) {
      return {
        str,
        useStylus: true
      };
    }
    //No match
    if (!self.regexSyntaxYaml.test(str)) {
      return {
        str,
        useStylus: true
      };
    }
    //if str has special SYNTAX YAML comment we want to remove
    return {
      useStylus: false,
      str: str.replace(self.regexSyntaxYaml, '')
    };
  }




  /**
   * Wrapper around yaml parser that turns string yaml data into real yaml Object data
   * @param  {str} str -> String to parse/process
   * @return {obj}     -> Regardless we return an Object
   */
  processYaml (str) {
    try {
      return yaml.safeLoad(str);
    } catch (e) {
      throwErr({
        type: 'ctr Less - YAML Parse Error, Skipping...',
        msg: e,
        code: str
      });
      return {};
    }
  }



  /**
   * Extracts and then strips the the options props from the ctr instance.
   * This is a bit tricky, and fingers-crossed it works propperly
   * @param  {str} str -> string to extraxt and strip
   * @return {obj}
   */
  stripOption (str) {
    const self = this;

    let option = {};
    //cycle regex option matches
    _.forEach(self.regexOption, function (reg) {
      const match = reg.test(str);
      //if there's a match we will remove it from the string and add it to opts
      if (match) {
        try {
          str = str.replace(reg, function (val) {
            option = _.defaultsDeep(option, yaml.safeLoad(val));
            return '';
          });
        } catch (e) {
          throwErr({
            type: 'ctr Less - YAML Parse Error, Skipping...',
            msg: e,
            code: str
          });
        }
      }
    });

    //If we extracted options we have to fix the str otherwise the
    //yaml parsing will be fucked. Technically, all that should
    //be left of the option object is ->   }, {
    if (!_.isEmpty(option)) {
      const regexCleanEmpty = new RegExp(/},([\s|{]*?)$/g);
      str = str.replace(regexCleanEmpty, '');
    }
    //->
    return {
      str,
      option
    };
  }



  /**
   * Strips ctr instance so that all we are left with is the YAML String data
   * which we will then be able to parse
   * @param  {str} str      -> String data to strip
   * @param  {reg} startReg -> Regex match to replace
   * @param  {num} slice    -> Slice amount to remove
   * @return {str, str}     -> Seperates our ctr instance into the core data
   *                           and the selector if its a ctrStyle instance
   */
  stripStyle (str, startReg, slice = 4) {
    const self = this;
    //extract the selector
    let selector = str.slice(slice)
                      .replace(self.regexStrip.selectorReplace, '')
                      .match(self.regexStrip.selectorMatch)[0];
    //remove double string need be
    selector = selector.replace(self.regexStrip.selectorClean, '');
    //remove the first and last chars of ctr instance so all that is left
    //is the data str yaml object to work with
    const data = str.replace(startReg, '').replace(self.regexStrip.dataReplace, '');
    //->
    return {
      data,
      selector
    };
  }
}



/**
 * Entry point for the Less plugin initialization
 * @param  {obj} option -> Set global ctr options + Less ctr specific options
 */
let ctrLessInstance = null;
const ctrLessPlugin = function (option = {}) {
  /**
   * The reason we are employing global scope assignment is to ensure the
   * instances leverage memoization otherwise the user has to esure they plug in
   * the plugin the proper way so it does not re-initialize the instance.
   * This way the user can't fuck up, which is what we want, no fuck ups.
   */
  ctrLessInstance = ctrLessInstance || new CtrLess(option);
  return {
    install: function(less, pluginManager) {
      pluginManager.addPreProcessor(ctrLessInstance);
    }
  };
};



module.exports = ctrLessPlugin;


