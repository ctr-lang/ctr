
module.exports = {
  name: 'rotateOut',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      'transform-origin': 'center',
      opacity: '1'
    },
    to: {
      'transform-origin': 'center',
      transform: 'rotate3d(0, 0, 1, 200deg)',
      opacity: '0'
    }
  }
};
