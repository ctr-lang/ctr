const base = require('./base.js');

const earlybird = base({
  filter: ['contrast(0.9)', 'sepia(0.2)'],
  customElementFilterAfter: {
    background: 'radial-gradient(circle, #d0ba8e 20%, #360309 85%, #1d0210 100%)',
    'mix-blend-mode': 'overlay'
  }
});

module.exports = earlybird;
