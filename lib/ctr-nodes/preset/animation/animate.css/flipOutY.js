
module.exports = {
  name: 'flipOutY',
  'backface-visibility': 'visible !important',
  option: {
    duration: '0.75s',
    mode: 'both'
  },
  timeline: {
    from: {
      transform: 'perspective(400px)'
    },
    '30%': {
      transform: 'perspective(400px) rotate3d(0, 1, 0, -15deg)',
      opacity: '1'
    },
    to: {
      transform: 'perspective(400px) rotate3d(0, 1, 0, 90deg)',
      opacity: '0'
    }
  }
};
