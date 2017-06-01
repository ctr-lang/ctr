const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create({
  //global
  $$: {
    color: 'red',
    width: '200px'
  },
  '.test': {
    color: 'alpha($color$, 0.2)',
    width: '$width$'
  },
  '.test2': {
    //local
    $$: {
      color: 'blue'
    },
    color: 'alpha($color$, 0.2)',
    width: '$width$'
  }
});


const res = ctr.getResult();

module.exports = {
  res: res
};
