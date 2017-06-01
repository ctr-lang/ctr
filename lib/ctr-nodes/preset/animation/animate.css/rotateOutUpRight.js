
module.exports = {
  name: 'rotateOutUpRight',
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
      transform: 'rotate3d(0, 0, 1, 90deg)',
      opacity: '0'
    }
  }
};
