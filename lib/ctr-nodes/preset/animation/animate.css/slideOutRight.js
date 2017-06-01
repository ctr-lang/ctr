
module.exports = {
  name: 'slideOutRight',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      transform: 'translate3d(0, 0, 0)'
    },
    to: {
      visibility: 'hidden',
      transform: 'translate3d(100%, 0, 0)'
    }
  }
};
