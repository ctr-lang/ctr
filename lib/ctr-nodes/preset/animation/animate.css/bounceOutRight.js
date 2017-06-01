
module.exports = {
  name: 'bounceOutRight',
  option: {
    duration: '1s',
    mode: 'both'
  },
  timeline: {
    '20%': {
      opacity: '1',
      transform: 'translate3d(-20px, 0, 0)'
    },
    to: {
      opacity: '0',
      transform: 'translate3d(2000px, 0, 0)'
    }
  }
};
