
module.exports = {
  name: 'rotateOutUpLeft',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      'transform-origin': 'left bottom',
      opacity: '1'
    },
    to: {
      'transform-origin': 'left bottom',
      transform: 'rotate3d(0, 0, 1, -45deg)',
      opacity: '0'
    }
  }
};
