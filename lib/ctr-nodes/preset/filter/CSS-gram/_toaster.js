const base = require('./base.js');

const toaster = base({
  filter: ['contrast(1.5)', 'brightness(0.9)'],
  customElementFilterBefore: {
    background: 'radial-gradient(circle, #804e0f, #3b003b)',
    'mix-blend-mode': 'screen'
  }
});

module.exports = toaster;
