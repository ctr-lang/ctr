
module.exports = {
  name: 'fadeOutLeft',
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
      transform: 'translate3d(-100%, 0, 0)'
    }
  }
};
