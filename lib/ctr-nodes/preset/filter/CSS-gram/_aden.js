const base = require('./base.js');

const aden = base({
  filter: ['hue-rotate(-20deg)', 'contrast(0.9)', 'saturate(0.85)', 'brightness(1.2)'],
  customElementFilterAfter: {
    background: 'linear-gradient(to right, rgba(66, 10, 14, 0.2), transparent)',
    'mix-blend-mode': 'darken'
  }
});

module.exports = aden;
