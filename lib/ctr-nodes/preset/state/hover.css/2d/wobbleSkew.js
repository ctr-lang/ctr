
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
      name: 'hvr-wobble-skew',
      option: {
        duration: '1s',
        ease: 'ease-in-out',
        count: '1'
      },
      timeline: {
        '16.65%': {
          transform: 'skew(-12deg)'
        },
        '33.3%': {
          transform: 'skew(10deg)'
        },
        '49.95%': {
          transform: 'skew(-6deg)'
        },
        '66.6%': {
          transform: 'skew(4deg)'
        },
        '83.25%': {
          transform: 'skew(-2deg)'
        },
        '100%': {
          transform: 'skew(0)'
        }
      }
    }
  },
  non: { }
};
