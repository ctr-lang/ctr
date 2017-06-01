
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
      name: 'hvr-wobble-to-bottom-right',
      option: {
        duration: '1s',
        ease: 'ease-in-out',
        count: '1'
      },
      timeline: {
        '16.65%': {
          transform: 'translate(8px, 8px)'
        },
        '33.3%': {
          transform: 'translate(-6px, -6px)'
        },
        '49.95%': {
          transform: 'translate(4px, 4px)'
        },
        '66.6%': {
          transform: 'translate(-2px, -2px)'
        },
        '83.25%': {
          transform: 'translate(1px, 1px)'
        },
        '100%': {
          transform: 'translate(0, 0)'
        }
      }
    }
  },
  non: { }
};
