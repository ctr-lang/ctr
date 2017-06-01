const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create({
  //obj keys are the selectors
  '.test1': {
    width: '200px',
    height: '200px'
  },
  '.test2': {
    width: '200px',
    height: '200px'
  }
});

const res = ctr.getRes();


module.exports = {
  res: res
};
