const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create({
  //obj keys are the selectors
  '.test1': {
    width: '200px',
    height: '200px',
    hover: {
      on: {
        width: '400px'
      }
    }
  },
  '.test2': {
    width: '200px',
    height: '200px',
    hover: {
      on: {
        width: '400px'
      }
    }
  }
}, {
  hover: {
    duration: '10s'
  }
});

const res = ctr.getRes();

module.exports = {
  res: res
};
