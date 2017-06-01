
module.exports = {
  name: 'lightSpeedIn',
  option: {
    duration: '1s',
    mode: 'both',
    ease: 'ease-out'
  },
  timeline: {
    from: {
      transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
      opacity: '0'
    },
    '60%': {
      transform: 'skewX(20deg)',
      opacity: '1'
    },
    '80%': {
      transform: 'skewX(-5deg)',
      opacity: '1'
    },
    to: {
      transform: 'none',
      opacity: '1'
    }
  }
};
