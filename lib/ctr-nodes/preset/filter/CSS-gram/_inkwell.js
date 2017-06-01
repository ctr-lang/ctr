const base = require('./base.js');

const inkwell = base({
  filter: ['sepia(0.3)', 'contrast(1.1)', 'brightness(1.1)', 'grayscale(1)']
});

module.exports = inkwell;
