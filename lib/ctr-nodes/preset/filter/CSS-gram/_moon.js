const base = require('./base.js');

const moon = base({
  filter: ['grayscale(1)', 'contrast(1.1)', 'brightness(1.1)'],
  customElementFilterBefore: {
    background: '#a0a0a0',
    'mix-blend-mode': 'soft-light'
  },
  customElementFilterAfter: {
    background: '#383838',
    'mix-blend-mode': 'lighten'
  }
});

module.exports = moon;
