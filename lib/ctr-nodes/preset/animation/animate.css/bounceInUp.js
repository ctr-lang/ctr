
module.exports = {
  name: 'bounceInUp',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    'from, 60%, 75%, 90%, to': {
      'animation-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)'
    },
    from: {
      opacity: '0',
      transform: 'translate3d(0, 3000px, 0)'
    },
    '60%': {
      opacity: '1',
      transform: 'translate3d(0, -20px, 0)'
    },
    '75%': {
      transform: 'translate3d(0, 10px, 0)'
    },
    '90%': {
      transform: 'translate3d(0, -5px, 0)'
    },
    to: {
      transform: 'translate3d(0, 0, 0)'
    }
  }
};