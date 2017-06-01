
module.exports = {
  name: 'flash',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    'from, 50%, to': {
      opacity: 1
    },
    '25%, 75%': {
      opacity: 0
    }
  }
};
