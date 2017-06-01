
/* originally authored by Nick Pettit - https://github.com/nickpettit/glide */

module.exports = {
  name: 'pulse',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    from: {
      transform: 'scale3d(1, 1, 1)'
    },
    '50%': {
      transform: 'scale3d(1.05, 1.05, 1.05)'
    },
    to: {
      transform: 'scale3d(1, 1, 1)'
    }
  }
};
