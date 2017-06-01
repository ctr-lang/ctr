const base = require('./base.js');

const maven = base({
  filter: ['sepia(0.25)', 'brightness(0.95)', 'contrast(0.95)', 'saturate(1.5)'],
  customElementFilterAfter: {
    background: 'rgba(3, 230, 26, 0.2)',
    'mix-blend-mode': 'hue'
  }
});

module.exports = maven;
