const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  option: {
    duration: '1s'
  }
});

ctr.create('.test', {
  background: 'black',
  hover: {
    mergeWith: [function (context) {
      //this binded to ctr instance
      if (!this || !context) { throw 'ctr not binded or arg not passed'; }
      return {
        option: {
          duration: '1s'
        }
      };
    }, function (context) {
      if (!this || !context) { throw 'ctr not binded or arg not passed'; }
      return {
        option: {
          delay: '1s'
        }
      };
    }],
    on: {
      width: '200px'
    },
    non: {
      width: '100px'
    }
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
