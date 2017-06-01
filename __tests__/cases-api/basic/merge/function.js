const CTR  = require('ctr').js;
const ctr  = new CTR();


ctr.create('.test', {
  background: 'black',
  hover: {
    option: {
      //merges in option res
      merge: function (context) {
        //this binded to ctr instance
        if (!this || !context) { throw 'ctr not binded or arg not passed'; }
        return {
          duration: '1s'
        };
      }
    },
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
