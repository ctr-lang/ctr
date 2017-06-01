
module.exports = {
  static: {
    display: 'inline-block',
    'vertical-align': 'middle',
    'box-shadow': '0 0 1px rgba(0, 0, 0, 0)',
    'backface-visibility': 'hidden',
    '-moz-osx-font-smoothing': 'grayscale'
  },
  on: {
    animation: {
      name: 'hvr-buzz',
      option: {
        duration: '0.15s',
        ease: 'linear',
        count: 'infinite'
      },
      timeline: {
        '50%': {
          transform: 'translateX(3px) rotate(2deg)'
        },
        '100%': {
          transform: 'translateX(-3px) rotate(-2deg)'
        }
      }
    }
  },
  non: { }
};
