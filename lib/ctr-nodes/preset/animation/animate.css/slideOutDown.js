
module.exports = {
  name: 'slideOutDown',
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
      transform: 'translate3d(0, 100%, 0)'
    }
  }
};
