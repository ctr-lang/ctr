const base = require('./base.js');

const walden = base({
  filter: ['brightness(1.1)', 'hue-rotate(-10deg)', 'sepia(0.3)', 'saturate(1.6)'],
  customElementFilterBefore: {
    background: '#0044cc',
    'mix-blend-mode': 'screen',
    opacity: '0.3'
  }
});

module.exports = walden;
