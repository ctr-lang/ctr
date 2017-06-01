const _     = require('lodash');
const fs    = require('fs-extra');
const glob  = require('glob-all');
const colur = require('colur');

const normalizeContent = function (str) {
  return str.replace(/\r/g, '').trim();
};
const readFile = function (path) {
  return normalizeContent(fs.readFileSync(path, 'utf-8'));
};


const toYamlSyntax = function (str, testLoc) {
  //comments
  str = str.replace(/\s{|}/g, '');
  //remove empty lines
  str = str.replace(/^\s*\n/gm, '');
  //Stylus List Matcher ->  converts to an Array
  if (!testLoc.includes('less.styl') && !testLoc.includes('less-yml.styl')) {
    _.forEach(str.match(/:.+/g), function (val) {
      const spaces = val.match(/\s/g);
      const string = _.isArray(val.match(/'|"/g)) && val.match(/'|"/g).length === 2
                     && _.isArray(val.match(/^:\s('|")/)) && _.isArray(val.match(/('|")$/));
      if (!string && spaces && spaces.length >= 2 && val.match(/^:/) && !val.match(/\(.*\)/g)) {
        const list = val.split(' ');
        list.shift();
        const matchReplace = list.join(' ');
        const listArray = '[' + list.join(', ') + ']';
        str = str.replace(matchReplace, listArray);
      }else if (!string && val.includes('#') && _.isNull(val.match(/^:\s('|")/))) {
        const list = val.split(' ');
        list.shift();
        const matchReplace = list.join(' ');
        const stringed = "'" + list.join(' ') + "'";
        str = str.replace(matchReplace, stringed);
      }
    });
  }
  //->
  return str;
};

/**
 * Formats special instances of ctr like ctrSetOption
 * @param  {str} str     -> str to format
 * @param  {str} testLoc -> location of test
 * @param  {reg} regex   -> regex ref to format
 * @return {str}         -> formatted string
 */
const formatSpecial = function (str, testLoc, regex) {
  //replace this place!
  return str.replace(regex, function (_str) {
    let ctrClass = _str.match(regex)[0];
    const addComment = '\n  // SYNTAX_YAML' + ctrClass.slice(ctrClass.indexOf('{') + 1);
    ctrClass = ctrClass.slice(0, ctrClass.indexOf('{') + 1) + addComment;
    //strip out first and last line
    const first = ctrClass.slice(0, ctrClass.indexOf('\n') + 1);
    const last = ctrClass.slice(ctrClass.lastIndexOf('\n'));
    //remove first and last
    ctrClass = ctrClass.substring(ctrClass.indexOf('\n') + 1);
    ctrClass = ctrClass.substring(0, ctrClass.lastIndexOf('\n'));
    //format to yaml
    ctrClass = toYamlSyntax(ctrClass, testLoc);
    //put dat shit back together
    ctrClass = first + ctrClass + last;
    //add to str file
    _str = `\n${ctrClass}\n\n${_str}`;
    //remove extra space
    _str = _str.replace(/\sctrS/g, 'ctrS');
    _str = _str.replace(/\sctrA/g, 'ctrA');
    //remove double comma
    _str = _str.replace(/,,/g, ',');
    return _str;
  });
};

/**
 * Gens ctrSetClass yaml syntax
 */
const checkForCtrSet = function (str, testLoc) {
  if (!testLoc.includes('less.styl') && !testLoc.includes('less-yml.styl')) {
    if (str.includes('ctrSetClass')) {
      str = formatSpecial(str, testLoc, new RegExp(/ctrSetClass[\s\S]*?}\)/g));
    }
    if (str.includes('ctrSetOption')) {
      str = formatSpecial(str, testLoc, new RegExp(/ctrSetOption[\s\S]*?}\)/g));
    }
    if (str.includes('ctrSetVariable')) {
      str = formatSpecial(str, testLoc, new RegExp(/ctrSetVariable[\s\S]*?}\)/g));
    }
  }
  return str;
};


/**
 * Compoese yaml, formats and writes
 * @param  {str} testLoc -> test location
 */
const composeLess = function (testLoc) {
  //read,clean and compose
  let file = readFile(testLoc);

  //check for ctr classes
  file = checkForCtrSet(file, testLoc);

  //convert imparitive stylus to yaml syntax less
  file = file.replace(/\.test\n\s\sctr\({([\s\S]*?)}\)/g, function (str) {
    //remove test selector
    str = str.replace(/\.test/, '');
    //remove leading two space on each line
    str = str.replace(/^\s{1}/gm, '');
    //remove first and last line so that we can convert to less syntax
    str = str.substring(str.indexOf('\n') + 1);
    str = str.substring(0, str.lastIndexOf('\n'));
    //convert to yaml syntax
    str = toYamlSyntax(str, testLoc);
    //format back together
    str = `
ctr('.test', {
   // SYNTAX_YAML
${str}
})`;

    //makes spacing even
    str = str.replace(/^\s{1}/gm, '');
    //->
    return str;
  });

  //add generated comment
  file = `// File generated from ---> ${testLoc.replace(/\S+\//, '')} \n\n` + file;

  let res = null;
  if (testLoc.match(/less-yml\.styl/)) {
    res = testLoc.replace('.less-yml.styl', '.less-yml.less');
  }else if (testLoc.match(/\.less\.styl/)) {
    res = testLoc.replace('.less.styl', '.less');
  }else {
    res = testLoc.replace('.styl', '.less');
  }

  //write out the file
  fs.writeFileSync(res, file);
};


//Specific files to omit
const omitList = [
  //basic
  '__tests__/cases-core/basic/bifs/lookup.styl',
  '__tests__/cases-core/basic/general/iteration-variable.styl',
  '__tests__/cases-core/basic/general/iteration.styl',
  // '__tests__/cases-core/basic/general/selector-concat.styl',
  '__tests__/cases-core/basic/general/selector.styl',
  // '__tests__/cases-core/basic/general/style-overwrite.styl',
  //merge
  // '__tests__/cases-core/merge/ctr-class/basic.styl',
  //merege
  '__tests__/cases-core/ctr-class/feature/merge.styl',
  '__tests__/cases-core/ctr-class/general/basic-alternative-syntax.styl',
  //format issues
  '__tests__/cases-core/ctr-class/general/bootstrap-button-example.styl',
  //stylus only
  '__tests__/cases-core/ctr-class/general/ensure-order.styl',
  '__tests__/cases-core/ctr-class/general/merge-in-class.styl'
];


/**
 * Finds .styl files to build yaml
 * @return {---} -> generated yaml files
 */
const lessBuild = function () {
  colur('__tests__/run.less.build.js:::build -> START');
  const stylGlob = glob.sync([
    '__tests__/cases-core/**/*.styl',
    '!__tests__/cases-core/stylus/**',
    '!__tests__/cases-core/**/*yml.styl',
    '__tests__/cases-core/**/*less-yml.styl',
    // formating of timeline differs from stylus to less
    '!__tests__/cases-core/animation/preset/animate.css/**',
    //cannot use external vars in less
    '!__tests__/cases-core/merge/general/external/**',
    //wrote by hand for the time being
    '!__tests__/cases-core/ctr-set/**'
  ]);

  //loop glob, check if its on the omit list and ext, then compose
  _.forEach(stylGlob, function (testLoc) {
    const omitListCheck = omitList.indexOf(testLoc.replace(/.{1,}\/ctr\//gi, '')) === -1;
    const lessStylFile = stylGlob.indexOf(testLoc.replace(/\.styl/, '.less.styl')) === -1;
    const lessStylYmlFile = stylGlob.indexOf(testLoc.replace(/\.styl/, '.less-yml.styl')) === -1;
    if (lessStylFile && lessStylYmlFile && omitListCheck) {
      composeLess(testLoc);
    }
  });
  colur('__tests__/run.less.build.js:::build -> END', {end: true});
};

//if we are calling from a script invoke the funk
if (process.env.NPM) {
  lessBuild();
}

module.exports = lessBuild;

