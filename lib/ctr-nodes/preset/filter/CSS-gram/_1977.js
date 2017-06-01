const base = require('./base.js');


const _1997 = base({
  filter: ['contrast(1.1)', 'brightness(1.1)', 'saturate(1.3)'],
  customElementFilterAfter: {
    background: 'rgba(243, 106, 188, 0.3)',
    'mix-blend-mode': 'screen'
  }
});

module.exports = _1997;
