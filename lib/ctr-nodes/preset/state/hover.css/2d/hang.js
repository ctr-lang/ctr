
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
      //hang
      hang: {
        name: 'hvr-hang',
        option: {
          duration: '1.5s',
          delay: '0.3s',
          ease: 'ease-in-out',
          count: 'infinite',
          mode: 'fowards',
          direction: 'alternate'
        },
        timeline: {
          '0%': {
            transform: 'translateY(8px)'
          },
          '50%': {
            transform: 'translateY(4px)'
          },
          '100%': {
            transform: 'translateY(8px)'
          }
        }
      },
      //hang-sink
      hangSink: {
        name: 'hvr-hang-sink',
        option: {
          duration: '0.3s',
          delay: '0s',
          ease: 'ease-out',
          count: '1',
          mode: 'fowards',
          direction: 'normal'
        },
        timeline: {
          '100%': {
            transform: 'translateY(8px)'
          }
        }
      }
    }
  },
  non: { }
};
