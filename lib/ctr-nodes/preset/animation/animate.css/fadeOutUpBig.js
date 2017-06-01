
module.exports = {
  name: 'fadeOutUpBig',
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
      transform: 'translate3d(0, -2000px, 0)'
    }
  }
};
