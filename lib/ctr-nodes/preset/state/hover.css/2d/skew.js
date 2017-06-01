
module.exports = {
  static: {
    display: 'inline-block',
    'vertical-align': 'middle',
    'box-shadow': '0 0 1px rgba(0, 0, 0, 0)',
    'backface-visibility': 'hidden',
    '-moz-osx-font-smoothing': 'grayscale'
  },
  on: {
    transform: 'skew(-10deg)',
    option: {
      shorthand: {
        transform: ['0.3s']
      }
    }
  },
  non: {
    transform: 'translateZ(0)',
    option: {
      shorthand: {
        transform: ['0.3s']
      }
    }
  }
};
