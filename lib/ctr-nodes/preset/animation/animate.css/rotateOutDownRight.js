
module.exports = {
  name: 'rotateOutDownRight',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      'transform-origin': 'right bottom',
      opacity: '1'
    },
    to: {
      'transform-origin': 'right bottom',
      transform: 'rotate3d(0, 0, 1, -45deg)',
      opacity: '0'
    }
  }
};
