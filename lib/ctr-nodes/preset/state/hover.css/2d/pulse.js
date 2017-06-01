
module.exports = {
  static: {
    display: 'inline-block',
    'vertical-align': 'middle',
    'box-shadow': '0 0 1px rgba(0, 0, 0, 0)',
    'backface-visibility': 'hidden',
    transform: 'translateZ(0)',
    '-moz-osx-font-smoothing': 'grayscale'
  },
  on: {
    animation: {
      name: 'hvr-pulse',
      option: {
        count: 'infinite',
        duration: '1s',
        ease: 'linear'
      },
      timeline: {
        '25%': {
          transform: 'scale(1.1)'
        },
        '75%': {
          transform: 'scale(0.9)'
        }
      }
    }
  },
  non: {}
};
