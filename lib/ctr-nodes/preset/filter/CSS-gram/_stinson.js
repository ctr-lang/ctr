const base = require('./base.js');

const stinson = base({
  filter: ['contrast(0.75)', 'saturate(0.85)', 'brightness(1.15)'],
  customElementFilterBefore: {
    background: 'rgba(240, 149, 128, 0.2)',
    'mix-blend-mode': 'soft-light'
  }
});

module.exports = stinson;
