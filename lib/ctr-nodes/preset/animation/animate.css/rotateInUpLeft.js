
module.exports = {
  name: 'rotateInUpLeft',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      'transform-origin': 'left bottom',
      transform: 'rotate3d(0, 0, 1, 45deg)',
      opacity: '0'
    },
    to: {
      'transform-origin': 'left bottom',
      transform: 'none',
      opacity: '1'
    }
  }
};
