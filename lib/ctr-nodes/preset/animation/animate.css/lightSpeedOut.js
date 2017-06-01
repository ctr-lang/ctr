
module.exports = {
  name: 'lightSpeedOut',
  option: {
    duration: '1s',
    mode: 'both',
    ease: 'ease-in'
  },
  timeline: {
    from: {
      opacity: '1'
    },
    to: {
      transform: 'translate3d(100%, 0, 0) skewX(30deg)',
      opacity: '0'
    }
  }
};
