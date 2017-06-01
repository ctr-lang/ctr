
module.exports = {
  name: 'fadeInDownBig',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      opacity: '0',
      transform: 'translate3d(0, -2000px, 0)'
    },
    to: {
      opacity: '1',
      transform: 'none'
    }
  }
};
