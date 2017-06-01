const _H = require('../helpers/helper-index.js');

module.exports = function (err, dataObj) {
  if (err === 'shorthandSyntax') {
    _H.throwErr({
      type: 'Syntax',
      exp: 'Object',
      rec: dataObj,
      msg: 'default'
    });
  }else if (err === 'duplicateKey') {
    _H.throwErr({
      type: 'Duplicate Key',
      msg: ['There is a duplicate key in your transition. The duplicate key',
            'in question is: ', JSON.stringify(dataObj.prop), ' --> Ps. I will just',
            'keep the first one you gave me and ditch the other.'].join(' '),
      code: dataObj.code
    });
  }else if (err === 'duplicateShorthand') {
    _H.throwErr({
      type: 'Duplicate Shorthand Key',
      msg: ['There is a duplicate key in your shorthand. The duplicate key',
            'in question is: ', JSON.stringify(dataObj.prop), ' --> Ps. I will',
            'just keep the first one you gave me and ditch the other.'].join(' '),
      code: dataObj.code
    });
  }else if (err === 'emptyTransition') {
    _H.throwErr({
      type: 'Emptiness',
      code: dataObj,
      msg: ['Sorry, but the transition your want to make happen with your',
            'state came up empty. This is most likely your fault, or it could',
            'be mine. Either way, I will need to omit the transition for you.'].join(' ')
    });
  }

//removed, maybe add back
// else if (err === 'globalOptFormate') {
//     _H.throwErr({
//       type: 'Formate Issue',
//       code: dataObj,
//       msg: ['I hate to be a stickler but you should really put your',
//             'global options inside the option object to keep all things',
//             'somewhat uniformed. I took care of it for you this time,',
//             'but please reformate your code to look like the above code.'].join(' ')
//     });
//   }
};
