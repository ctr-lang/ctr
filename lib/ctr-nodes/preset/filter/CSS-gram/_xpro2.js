const base = require('./base.js');

const xpro2 = base({
  filter: ['sepia(0.3)'],
  customElementFilterAfter: {
    background: 'radial-gradient(circle, #e6e7e0 40%, rgba(43, 42, 161, 0.6) 110%)',
    'mix-blend-mode': 'color-burn'
  }
});

module.exports = xpro2;
