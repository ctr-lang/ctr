
module.exports = {
  name: 'swing',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    '20%': {
      transform: 'rotate3d(0, 0, 1, 15deg)'
    },
    '40%': {
      transform: 'rotate3d(0, 0, 1, -10deg)'
    },
    '60%': {
      transform: 'rotate3d(0, 0, 1, 5deg)'
    },
    '80%': {
      transform: 'rotate3d(0, 0, 1, -5deg)'
    },
    to: {
      transform: 'rotate3d(0, 0, 1, 0deg)'
    }
  }
};
