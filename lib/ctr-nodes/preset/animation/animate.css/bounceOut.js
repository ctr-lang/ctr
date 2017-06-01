
module.exports = {
  name: 'bounceOut',
  option: {
    duration: '0.75s',
    mode: 'both'
  },
  timeline: {
    '20%': {
      transform: 'scale3d(.9, .9, .9)'
    },
    '50%, 55%': {
      opacity: '1',
      transform: 'scale3d(1.1, 1.1, 1.1)'
    },
    to: {
      opacity: '0',
      transform: 'scale3d(.3, .3, .3)'
    }
  }
};
