const base = require('./base.js');

const reyes = base({
  filter: ['sepia(0.22)', 'brightness(1.1)', 'contrast(0.85)', 'saturate(0.75)'],
  customElementFilterAfter: {
    background: '#efcdad',
    'mix-blend-mode': 'soft-light',
    opacity: '0.5'
  }
});

module.exports = reyes;
