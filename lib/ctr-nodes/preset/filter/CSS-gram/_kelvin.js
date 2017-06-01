const base = require('./base.js');

const kelvin = base({
  customElementFilterBefore: {
    background: '#382c34',
    'mix-blend-mode': 'color-dodge'
  },
  customElementFilterAfter: {
    background: '#b77d21',
    'mix-blend-mode': 'overlay'
  }
});

module.exports = kelvin;
