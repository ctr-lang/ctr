
module.exports = {
  static: {
    display: 'inline-block',
    'vertical-align': 'middle',
    'box-shadow': '0 0 1px rgba(0, 0, 0, 0)',
    'backface-visibility': 'hidden',
    transform: 'translateZ(0)',
    '-moz-osx-font-smoothing': 'grayscale'
  },
  on: {
    animation: {
      name: 'hvr-pulse-shrink',
      option: {
        count: 'infinite',
        duration: '0.3s',
        ease: 'linear',
        direction: 'alternate'
      },
      timeline: {
        to: {
          transform: 'scale(0.9)'
        }
      }
    }
  },
  non: {}
};
