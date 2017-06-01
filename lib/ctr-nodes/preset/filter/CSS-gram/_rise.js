const base = require('./base.js');

const rise = base({
  filter: ['brightness(1.05)', 'sepia(0.2)', 'contrast(0.9)', 'saturate(0.9)'],
  customElementFilterBefore: {
    background: 'radial-gradient(circle, rgba(236, 205, 169, 0.15) 55%, rgba(50, 30, 7, 0.4))',
    'mix-blend-mode': 'multiply'
  },
  customElementFilterAfter: {
    background: 'radial-gradient(circle, rgba(232, 197, 152, 0.8), transparent 90%)',
    'mix-blend-mode': 'overlay',
    opacity: '0.6'
  }
});

module.exports = rise;
