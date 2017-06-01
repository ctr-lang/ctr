const base = require('./base.js');

const gingham = base({
  filter: ['brightness(1.05)', 'hue-rotate(-10deg)'],
  customElementFilterAfter: {
    background: 'lavender',
    'mix-blend-mode': 'soft-light'
  }
});

module.exports = gingham;
