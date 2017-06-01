const teFlow       = require('te-flow');
const stateConfig  = require('./state-config.js');
const extractState = require('./state-extract.js');

const processState = function (stateKey, data, target) {
  teFlow.call({
    args: {
      stateKey: stateKey,
      data: data,
      target: target
    }},
    stateConfig,
    extractState
  );
};

module.exports = processState;
