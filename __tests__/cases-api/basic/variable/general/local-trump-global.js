const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.setVar({
  //should be trumed by yaml set vars
  height: '400px',
  color: 'red'
});

ctr.create('.test', {
  $$: {
    height: '200px',
    width: '300px'
  },
  height: '$height$',
  width: '$width$',
  color: '$color$'
});

const res = ctr.getRes();

module.exports = {
  res: res
};
