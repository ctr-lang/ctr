const _    = require('lodash');
const path = require('path');
const styl = require('./../stylus.js');
const ctr  = require('./../ctr-nodes/index.js');


/**
 * Private -> processes the data through Stylus + ctr to get
 * the resulting css output
 * @param  {str}   selector -> selecotr string
 * @param  {obj}   data     -> data object
 * @param  {obj}   option   -> local option object to be merged with global
 * @param  {fnk}   cb       -> callback @function
 * @return {cb}             -> returns the invoking callback
 */
const _dataProcess = function (selector, data, option = {}, cb) {
  const self = this;
  //error safty catch, short if there is an error
  if (self.error) {
    self._throwErr(self.error);
    return self;
  }
  //set vars
  const id  = self.selector;

  //safty check to make sure there is actually a data object
  if (!_.isPlainObject(data)) {
    const errMsg = `Captain, it looks like we have a problem! There is no
                    data for me to process. The selector for this data in
                    question is: "${selector}". In all likelihood you simply
                    forgot to give me style data to process or your format
                    is incorrect.`;
    self._throwErr({
      error: 'Missing Data or Format?',
      msg: errMsg
    });
    return self;
  }

  //set init stylus ref
  const style = styl(`ctr(".js", {JS: "${
    selector.includes(':::') ? selector.replace(/:::.*/g, '') : selector
  }"})`);
  style.include(path.resolve(__dirname));
  style.import('ctr');
  //check for source maps
  if (_.has(option, 'sourcemap') || self.globalOption.has('sourcemap')) {
    let sourcemap = _.get(option, 'sourcemap') || self.globalOption.get('sourcemap');
    sourcemap = sourcemap.toJS ? sourcemap.toJS() : sourcemap;
    sourcemap = sourcemap === true ? {} : sourcemap;
    //set
    style.set('sourcemap', sourcemap);
    //check for filename and set if string
    const filename = _.get(option, 'filename') || self.globalOption.get('filename');
    if (_.isString(filename)) {
      style.set('filename', filename);
    }
  }

  //merge in globalOption if any
  if (self.globalOption.size) {
    option = _.defaultsDeep(_.cloneDeep(option), self.globalOption.toJS());
  }

  //set result key
  self.resultKey = JSON.stringify({[selector]: data});
  self.resultKey += _.isEmpty(option) ? '' : JSON.stringify(option);
  //tack on the option to the key cus options === diff res
  //push selector to key set
  self.resultKeySet.push(self.resultKey);

  //cheack if selector has a modifier is so we need to chop it off
  selector = selector.includes(':::') ? selector.replace(/:::.*/g, '') : selector;

  //should always be true except for benchmarking
  const jsMemoize = self.globalOption.get('jsMemoize') !== false;
  //check for cache
  if (jsMemoize && self.resultDbMap.has(self.resultKey)) {
    //set rendered ref to true
    self.rendered = true;
    //return dat callback with catched res
    return cb(null, self.resultDbMap.get(self.resultKey), style, true);
  }

  //-> make and return magic if no cache
  return style.define('ctr', function () {
    return ctr.call(this, data, selector, id, option);
  }).render(function (err, res) {
    //set rendered ref to true
    self.rendered = true;
    //pass the stylus ref for sourcemap, ect
    return cb(err, res, style, false);
  });
};

module.exports = _dataProcess;
