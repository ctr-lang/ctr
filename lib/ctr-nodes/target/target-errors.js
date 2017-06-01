const throwErr = require('../helpers/helper-throw-err.js');

module.exports = function (err, dataObj) {
  if (err === 'attachTo') {
    throwErr({
      type: 'Oh No! Key Not Found!',
      msg: ['Your "attachTo" key was not found. The key you specified was: -> ',
            '' + JSON.stringify(dataObj.key) + '. Yet I could not found your key',
            'in the options avalible which are as follows: ->',
            '' + JSON.stringify(dataObj.keyOptions.join('  ...  ')) + ' . So you have two options',
            'number one, pick an "attachTo" key that is in the list. Or number two',
            'use the index (as in the number) to the key you wish to attachTo.',
            'As of right now I will just disregard the "attachTo" option.'].join(' ')
    });
  }
};
