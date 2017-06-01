
module.exports = {
  name: 'zoomIn',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      opacity: '0',
      transform: 'scale3d(.3, .3, .3)'
    },
    '50%': {
      opacity: 1
    }
  }
};
