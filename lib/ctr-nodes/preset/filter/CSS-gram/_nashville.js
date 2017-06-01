const base = require('./base.js');

const nashville = base({
  filter: ['sepia(0.2)', 'contrast(1.2)', 'brightness(1.05)', 'saturate(1.2)'],
  customElementFilterBefore: {
    background: 'rgba(247, 176, 153, 0.56)',
    'mix-blend-mode': 'darken'
  },
  customElementFilterAfter: {
    background: 'rgba(0, 70, 150, 0.4)',
    'mix-blend-mode': 'lighten'
  }
});

module.exports = nashville;
