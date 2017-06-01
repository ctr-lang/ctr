const base = require('./base.js');

const lofi = base({
  filter: ['saturate(1.1)', 'contrast(1.5)'],
  customElementFilterAfter: {
    background: 'radial-gradient(circle, transparent 70%, #222222 150%)',
    'mix-blend-mode': 'multiply'
  }
});

module.exports = lofi;
