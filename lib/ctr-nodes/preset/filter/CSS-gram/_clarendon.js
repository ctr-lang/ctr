const base = require('./base.js');

const clarendon = base({
  filter: ['contrast(1.2)', 'saturate(1.35)'],
  customElementFilterAfter: {
    background: 'rgba(127, 187, 227, 0.2)',
    'mix-blend-mode': 'overlay'
  }
});

module.exports = clarendon;
