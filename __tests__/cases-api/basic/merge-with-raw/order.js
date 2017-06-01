const CTR  = require('ctr').js;
const ctr  = new CTR();

const hoverOne = {
  'hover-on': {
    width: '200px',
    option: {
      duration: '1s',
      ease: 'ease-in'
    }
  }
};
const hoverTwo = {
  'hover-on': {
    height: '200px',
    //should not be merge in since one trumps
    width: '9999px',
    option: {
      duration: '99999s',
      ease: 'nope',
      //will merge in since not present in one
      delay: '1s'
    }
  }
};

ctr.create('.test', {
  background: 'black',
  //multiple merge, one trumps two
  mergeWith: [hoverOne, hoverTwo]
});

const res = ctr.getRes();

module.exports = {
  res: res
};
