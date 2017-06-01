const _ = require('lodash');

const localHelpers = {
  /**
   * Format the data by assign the data to the struc
   * @param  {obj} data  -> raw data obj
   * @param  {obj} struc -> The structur of data obj
   * @return {obj}       -> Formated data obj based on struc
   */
  formatData: function (data, struc) {
    //format to string to array
    data = _.isString(data) ? [data] : data;
    //config data to struc
    if (data === true) {
      return struc;
    }else if (_.isArray(data)) {
      //note the order is not garenteed but fuck it right now
      let keys = _.keys(struc);
      return _.reduce(data, function (prv, val, index) {
        if (val !== 'default') {
          prv[keys[index]] = val;
        }
        return prv;
      }, struc);
    }else if (_.isObject(data)) {
      //accounts for default in object syntax
      data = _.reduce(data, function (prv, val, key) {
        if (val !== 'default') {
          prv[key] = val;
        }
        return prv;
      }, {});
      return _.defaults(data, struc);
    }
    //default although it should not get here
    return struc;
  },
  getSize: function (gut, frac, move = false) {
    gut = _.isString(gut) ? gut : gut.toString();
    //format data
    const gutNum = parseFloat(gut.replace(/[^0-9\.]+/g, ''), 0);
    //config
    if (gutNum === 0) {
      return 'calc(99.9% * ' + frac + ')';
    }
    if (move) {
      return 'calc(99.9% * ' + frac + ' - (' + gut + ' - ' + gut + ' * ' + frac + ')' + '+' + gut + ')';
    }
    return 'calc(99.9% * ' + frac + ' - (' + gut + ' - ' + gut + ' * ' + frac + '))';
  }
};

module.exports = localHelpers;
