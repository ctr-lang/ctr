const CTR  = require('ctr').js;
const ctr  = new CTR();

ctr.create('.test', {
  $$: {
    color: 'red',
    key: ['.one', '.two'],
    selector: '.testOk',
    hover: {
      on: {
        width: '400px'
      }
    }
  },
  color: 'alpha($color$, 0.2)',
  component: {
    key: '$key$',
    width: '200px',
    hover: '$hover$',
    component: {
      key: ['.testMe', '$selector$'],
      'font-size': '10px',
      color: '$color$'
    }
  }
});


const res = ctr.getResult();

module.exports = {
  res: res
};
