const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create('.test', {
  $$: {
    //MUST specify
    variableUpdate: true,
    size: '200px',
    //ref above var
    height: '$size$',
    //ref above var
    width: '$height$'
  },
  height: '$height$',
  width: '$width$'
});


const res = ctr.getRes();

module.exports = {
  res: res
};
