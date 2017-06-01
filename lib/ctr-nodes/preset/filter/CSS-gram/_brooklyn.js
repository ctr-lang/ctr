const base = require('./base.js');

const brooklyn = base({
  filter: ['contrast(0.9)', 'brightness(1.1)'],
  customElementFilterAfter: {
    background: 'radial-gradient(circle, rgba(168, 223, 193, 0.4) 70%, #c4b7c8)',
    'mix-blend-mode': 'overlay'
  }
});

module.exports = brooklyn;
