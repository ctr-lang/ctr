
module.exports = {
  name: 'fadeInRight',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      opacity: '0',
      transform: 'translate3d(100%, 0, 0)'
    },
    to: {
      opacity: '1',
      transform: 'none'
    }
  }
};
