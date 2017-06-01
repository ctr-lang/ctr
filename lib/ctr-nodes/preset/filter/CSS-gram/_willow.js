const base = require('./base.js');

const willow = base({
  filter: ['grayscale(0.5)', 'contrast(0.95)', 'brightness(0.9)'],
  customElementFilterBefore: {
    background: 'radial-gradient(40%, circle, #d4a9af 55%, black 150%)',
    'mix-blend-mode': 'overlay'
  },
  customElementFilterAfter: {
    background: '#d8cdcb',
    'mix-blend-mode': 'color'
  }
});

module.exports = willow;
