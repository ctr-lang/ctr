const base = require('./base.js');

const hudson = base({
  filter: ['brightness(1.2)', 'contrast(0.9)', 'saturate(1.1)'],
  customElementFilterAfter: {
    background: 'radial-gradient(circle, #a6b1ff 50%, #342134)',
    'mix-blend-mode': 'multiply',
    opacity: '0.5'
  }
});

module.exports = hudson;
