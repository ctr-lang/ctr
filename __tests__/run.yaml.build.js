const _       = require('lodash');
const fs      = require('fs-extra');
const glob    = require('glob-all');
const colur   = require('colur');

/**
 * @note, this script is a shit show whose liquid drunk and needs to be fixed.
 * Take a page out of the docs build script and integrate ctrSet* writes since
 * currently I have to do them by hand.
 */


const normalizeContent = function (str) {
  return str.replace(/\r/g, '').trim();
};
const readFile = function (path) {
  return normalizeContent(fs.readFileSync(path, 'utf-8'));
};

/**
 * Strips/cleans stylus file so it can be phrased into yaml
 * @param  {str} str -> stylus file
 * @return {str}     -> cleand pras-able yaml file
 */
const stripStly = function (str, testLoc) {
  //clean the string
  const rmCommentsRegex = new RegExp(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm);
  str = str.replace(rmCommentsRegex, function (val) {
    //replace with yamal comment
    return val.replace('//', '# ');
  });

  //reduce vars
  const startImp = '  ctr({';
  const startDec = "ctr('.test', {";
  const endImp = '  })';
  const endDec = '})';
  const yamlStart = '# yml start';
  const yamlEnd = '# yml end';
  let engaged = false;
  let count = 0;

  //reduce and build
  let stripped = _.reduce(str.split(/\r|\n/), function (prv, val) {
    const includes = _.includes([endImp, endDec, yamlEnd], val);
    if (engaged && !includes) {
      if (!prv[count]) {
        prv[count] = [];
      }
      prv[count].push(val);
    }

    //engages push if match start
    if (_.includes([startDec, startImp, yamlStart], val) && !engaged) {
      engaged = true;
    }else if (engaged && includes) {
      count++;
      //end push
      engaged = false;
    }
    return prv;
  }, {0: []});

  //join and remove brackets
  stripped = _.reduce(stripped, function (prv, styl) {
    styl = styl.join('\r\n').replace(/\s{|}/g, '');
    //stylus list to array, fingers crossed, unless its a *.yml.styl file
    if (!testLoc.includes('.yml.styl')) {

      //Stylus List Matcher ->  converts to an Array
      _.forEach(styl.match(/:.+/g), function (val) {
        const spaces = val.match(/\s/g);
        const string = _.isArray(val.match(/'|"/g)) && val.match(/'|"/g).length === 2
                       && _.isArray(val.match(/^:\s('|")/)) && _.isArray(val.match(/('|")$/));
        if (!string && spaces && spaces.length >= 2 && val.match(/^:/) && !val.match(/\(.*\)/g)) {
          const list = val.split(' ');
          list.shift();
          const matchReplace = list.join(' ');
          const listArray = '[' + list.join(', ') + ']';
          styl = styl.replace(matchReplace, listArray);
        }else if (!string && val.includes('#') && _.isNull(val.match(/^:\s('|")/))) {
          const list = val.split(' ');
          list.shift();
          const matchReplace = list.join(' ');
          const stringed = "'" + list.join(' ') + "'";
          styl = styl.replace(matchReplace, stringed);
        }
      });

    }
    prv.push(styl);
    return prv;
  }, []);

  return stripped;
};


/**
 * Compoese yaml, formats and writes
 * @param  {str} testLoc -> test location
 */
const composeYaml = function (testLoc) {
  //read,clean and compose
  let file = readFile(testLoc);
  file = stripStly(file, testLoc);

  //test pre-fix count
  let count = 0;
  //removes the extra spaced in the yamlfile
  const yamlFile = _.reduce(file, function (prv, val, index) {
    val = val.split('\r\n');

    //prefix comment to indicate its beening autogened
    if (index === 0) {
      prv.push('# File generated from ---> ' + testLoc.replace(/\S+\//, ''));
      prv.push('\n');
    }

    const specialYaml = val[0].match(/^\$\$|^\$ctr-option|^ctr:::setOption|^ctr:::setVariable/);
    //simple errors throw for files that dont match schema
    if (!specialYaml && val[0].match(/\s+/) === null) {
      console.error('Error loc: ' + testLoc);
      throw 'Match failed';
    }

    //configer the number of spaces, for formating
    let numOfS = 0;
    if (!specialYaml) {
      numOfS = val[0].match(/\s+/)[0].length;
      if (numOfS === 2) {
        numOfS = 0;
      }else if (numOfS !== 2) {
        numOfS /= 2;
        numOfS = !(numOfS % 2) ? numOfS : numOfS + 1;
      }
    }

    //removes extra spaces
    const cleanedVal = _.reduce(val, function (_prv, _val, _index, _arr) {
      //pushes index obj key
      if (_index === 0 && !specialYaml) {
        _prv.push('.test:::' + count + ':');
        ++count;
      }

      //sliced value
      const slicedVal = _val.slice(numOfS);
      //push and return, but we dont want to push spaces
      if ((_index <= _arr.length - 2 || 2) && !slicedVal.match(/^\s*$/gm)) {
        _prv.push(_val.slice(numOfS));
      }

      //add in some spaced for formating
      if (_index === _arr.length - 1) {
        if (_prv[_prv.length - 1] !== '') {
          _prv.push('');
          _prv.push('');
        }else if (_prv[_prv.length - 2] !== '') {
          _prv.push('');
        }
      }

      return _prv;
    }, []);

    prv.push(cleanedVal.join('\r\n'));
    return prv;
  }, []);

  //write out the file
  const res = testLoc.match(/\.yml\.styl/)
            ? testLoc.replace('.yml.styl', '.yml')
            : testLoc.replace('.styl', '.yml');
  fs.writeFileSync(res, yamlFile.join('\r\n'));
};


//Specific files to omit
const omitList = [
  //basic
  '__tests__/cases-core/basic/bifs/lookup.styl',
  '__tests__/cases-core/basic/general/iteration-variable.styl',
  '__tests__/cases-core/basic/general/iteration.styl',
  '__tests__/cases-core/basic/general/selector-concat.styl',
  '__tests__/cases-core/basic/general/selector.styl',
  '__tests__/cases-core/basic/general/style-overwrite.styl',
  //helpers
  '__tests__/cases-core/helpers/general/buttron.styl',
  //merge
  '__tests__/cases-core/merge/ctr-class/basic.styl'
];


/**
 * Finds .styl files to build yaml
 * @return {---} -> generated yaml files
 */
const yamlBuild = function () {
  colur('run.yaml.build.js:::build -> START');
  const stylGlob = glob.sync([
    '__tests__/cases-core/**/*.styl',
    '!__tests__/cases-core/**/*.less.styl',
    '!__tests__/cases-core/ctr-class/**',
    '!__tests__/cases-core/ctr-set/**',
    '!__tests__/cases-core/stylus/**'
  ]);

  //loop glob, check if its on the omit list and ext, then compose
  _.forEach(stylGlob, function (testLoc) {
    const ymlStylFile = stylGlob.indexOf(testLoc.replace(/\.styl/, '.yml.styl')) === -1;
    const omitListCheck = omitList.indexOf(testLoc.replace(/.{1,}\/ctr\//gi, '')) === -1;
    if (ymlStylFile && omitListCheck) {
      composeYaml(testLoc);
    }
  });
  colur('run.yaml.build.js:::build -> END', {end: true});
};


//if we are calling from a script invoke the funk
if (process.env.NPM) {
  yamlBuild();
}


module.exports = yamlBuild;

