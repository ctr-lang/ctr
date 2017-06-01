
module.exports = {
  name: 'slideInRight',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      transform: 'translate3d(100%, 0, 0)',
      visibility: 'visible'
    },
    to: {
      transform: 'translate3d(0, 0, 0)'
    }
  }
};
