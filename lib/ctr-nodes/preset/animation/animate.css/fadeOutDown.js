
module.exports = {
  name: 'fadeOutDown',
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
      transform: 'translate3d(0, 100%, 0)'
    }
  }
};
