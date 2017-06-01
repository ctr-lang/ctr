
module.exports = {
  static: {
    display: 'inline-block',
    'vertical-align': 'middle',
    'box-shadow': '0 0 1px rgba(0, 0, 0, 0)',
    'backface-visibility': 'hidden',
    '-moz-osx-font-smoothing': 'grayscale'
  },
  on: {
    animation: {
      name: 'hvr-buzz-out',
      option: {
        duration: '0.75s',
        ease: 'linear',
        count: '1'
      },
      timeline: {
        '10%': {
          transform: 'translateX(3px) rotate(2deg)'
        },
        '20%': {
          transform: 'translateX(-3px) rotate(-2deg)'
        },
        '30%': {
          transform: 'translateX(3px) rotate(2deg)'
        },
        '40%': {
          transform: 'translateX(-3px) rotate(-2deg)'
        },
        '50%': {
          transform: 'translateX(2px) rotate(1deg)'
        },
        '60%': {
          transform: 'translateX(-2px) rotate(-1deg)'
        },
        '70%': {
          transform: 'translateX(2px) rotate(1deg)'
        },
        '80%': {
          transform: 'translateX(-2px) rotate(-1deg)'
        },
        '90%': {
          transform: 'translateX(1px) rotate(0)'
        },
        '100%': {
          transform: 'translateX(-1px) rotate(0)'
        }
      }
    }
  },
  non: { }
};
