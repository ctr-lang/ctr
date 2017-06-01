
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
      name: 'hvr-push',
      option: {
        count: '1',
        duration: '0.3s',
        ease: 'linear'
      },
      timeline: {
        '50%': {
          transform: 'scale(0.8)'
        },
        '100%': {
          transform: 'scale(1)'
        }
      }
    }
  },
  non: {}
};
