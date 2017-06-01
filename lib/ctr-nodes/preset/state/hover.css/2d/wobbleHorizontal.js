
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
      name: 'hvr-wobble-horizontal',
      option: {
        duration: '1s',
        ease: 'ease-in-out',
        count: '1'
      },
      timeline: {
        '16.65%': {
          transform: 'translateX(8px)'
        },
        '33.3%': {
          transform: 'translateX(-6px)'
        },
        '49.95%': {
          transform: 'translateX(4px)'
        },
        '66.6%': {
          transform: 'translateX(-2px)'
        },
        '83.25%': {
          transform: 'translateX(1px)'
        },
        '100%': {
          transform: 'translateX(0)'
        }
      }
    }
  },
  non: { }
};
