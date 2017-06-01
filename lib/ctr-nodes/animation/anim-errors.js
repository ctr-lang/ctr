const _H = require('../helpers/helper-index.js');

module.exports = function (err, data) {
  if (err === 'syntax') {
    _H.throwErr({
      type: 'Syntax',
      exp: data.expected,
      rec: data.received,
      msg: 'default'
    });
  }else if (err === 'noName') {
    _H.throwErr({
      type: 'No Animation Name',
      code: data,
      msg: ['In order for me to configure your Animation I need a `name`',
            'key pair to work with since every Animation need a name so that',
            'it knows what timeline its refferncing. I will ignore this',
            'Animation until you give her a name.'].join(' ')
    });
  }else if (err === 'shortTooManyArgs') {
    _H.throwErr({
      type: 'Too Many Args',
      code: data,
      msg: ['Sorry, with this method I can only take one shorthand argument.',
           'If you are want to have multiple shorthands there is a way to do',
           'this all you need to do is take a look in a book (docs).'].join(' ')
    });
  }
};
