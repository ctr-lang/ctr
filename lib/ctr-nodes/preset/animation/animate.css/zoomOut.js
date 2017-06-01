
module.exports = {
  name: 'zoomOut',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      opacity: '1'
    },
    '50%': {
      opacity: '0',
      transform: 'scale3d(.3, .3, .3)'
    },
    to: {
      opacity: '0'
    }
  }
};
