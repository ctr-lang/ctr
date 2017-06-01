const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setOption({
  variableUpdate: true
});

ctr.create('.test', {
  $$: {
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
