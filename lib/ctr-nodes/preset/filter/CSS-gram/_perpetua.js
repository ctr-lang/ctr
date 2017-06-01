const base = require('./base.js');

const perpetua = base({
  customElementFilterAfter: {
    background: 'linear-gradient(to bottom, #005b9a, #e6c13d)',
    'mix-blend-mode': 'soft-light',
    opacity: '0.5'
  }
});

module.exports = perpetua;
