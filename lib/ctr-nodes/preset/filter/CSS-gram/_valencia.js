const base = require('./base.js');

const valencia = base({
  filter: ['contrast(1.08)', 'brightness(1.08)', 'sepia(0.08)'],
  customElementFilterBefore: {
    background: '#3a0339',
    'mix-blend-mode': 'exclusion',
    opacity: '0.5'
  }
});

module.exports = valencia;
