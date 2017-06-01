
const amaro = {
  position: 'relative',
  filter: ['hue-rotate(-10deg)', 'contrast(0.9)', 'brightness(1.1)', 'saturate(1.5)'],
  customComponentFilterImage: {
    option: {
      key: 'img',
      selector: false
    },
    width: '100%',
    'z-index': '1'
  },
  customElementsFilter: {
    common: {
      content: false,
      display: 'block',
      height: '100%',
      width: '100%',
      top: '0',
      left: '0',
      position: 'absolute',
      'pointer-events': 'none'
    },
    before: {
      'z-index': '2'
    },
    after: {
      'z-index': '3',
      'mix-blend-mode': 'screen'
    }
  }
};

module.exports = amaro;
