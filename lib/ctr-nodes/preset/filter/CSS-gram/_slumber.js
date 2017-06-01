const base = require('./base.js');

const slumber = base({
  filter: ['saturate(0.66)', 'brightness(1.05)'],
  customElementFilterBefore: {
    background: 'rgba(69, 41, 12, 0.4)',
    'mix-blend-mode': 'lighten'
  },
  customElementFilterAfter: {
    background: 'rgba(125, 105, 24, 0.5)',
    'mix-blend-mode': 'soft-light'
  }
});

module.exports = slumber;
