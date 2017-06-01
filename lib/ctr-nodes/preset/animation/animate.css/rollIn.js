
/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

module.exports = {
  name: 'rollIn',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      opacity: '0',
      transform: 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)'
    },
    to: {
      opacity: '1',
      transform: 'none'
    }
  }
};
