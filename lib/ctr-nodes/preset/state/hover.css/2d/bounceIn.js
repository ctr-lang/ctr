
module.exports = {
  static: {
    display: 'inline-block',
    'vertical-align': 'middle',
    'box-shadow': '0 0 1px rgba(0, 0, 0, 0)',
    'backface-visibility': 'hidden',
    '-moz-osx-font-smoothing': 'grayscale'
  },
  on: {
    transform: 'scale(1.2)',
    option: {
      shorthand: {
        transform: ['0.5s', 'default', 'cubic-bezier(0.47, 2.02, 0.31, -0.36)']
      }
    }
  },
  non: {
    transform: 'translateZ(0)',
    option: {
      shorthand: {
        transform: ['0.5s']
      }
    }
  }
};
