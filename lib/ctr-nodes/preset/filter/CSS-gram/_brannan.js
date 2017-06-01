const base = require('./base.js');

const brannan = base({
  filter: ['sepia(0.5)', 'contrast(1.4)'],
  customElementFilterAfter: {
    background: 'rgba(161, 44, 199, 0.31)',
    'mix-blend-mode': 'lighten'
  }
});

module.exports = brannan;
