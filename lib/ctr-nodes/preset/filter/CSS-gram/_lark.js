const base = require('./base.js');

const lark = base({
  filter: ['contrast(0.9)'],
  customElementFilterBefore: {
    background: '#22253f',
    'mix-blend-mode': 'color-dodge'
  },
  customElementFilterAfter: {
    background: 'rgba(242, 242, 242, 0.8)',
    'mix-blend-mode': 'darken'
  }
});

module.exports = lark;
