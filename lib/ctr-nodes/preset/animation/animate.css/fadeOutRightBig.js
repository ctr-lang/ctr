
module.exports = {
  name: 'fadeOutRightBig',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      opacity: '1'
    },
    to: {
      opacity: '0',
      transform: 'translate3d(2000px, 0, 0)'
    }
  }
};
