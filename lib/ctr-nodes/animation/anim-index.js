const teFlow      = require('te-flow');
const animConfig  = require('./anim-config.js');
const animExtract = require('./anim-extract.js');
const animCompose = require('./anim-compose.js');

/**
 * Animation entry, in general this is a mess compared to others. It was one
 * of the first feature I wrote and it shows, its yuck, and I seem confused
 * as to what I was thinking or doing
 */
const animGenerate = function (key, data, option = {}) {
  return teFlow.call({
    args: {
      key: key,
      data: data,
      option: option
    }},
    animConfig,
    animExtract,
    animCompose, {
      return: function (animMap) {
        //@todo options ? return val ? needed??
        return animMap;
      }
    }
  );
};

module.exports = animGenerate;
