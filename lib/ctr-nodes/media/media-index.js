const teFlow       = require('te-flow');
const mediaConfig  = require('./media-config.js');
const mediaCompose = require('./media-compose.js');

/**
 * #mediaGenerate
 * The starting point for generating the media q's. It will send off the args
 * to `mediaConfig` whose return will be passed onto `mediaComposed` and then
 * those results will be processed in the `return` bellow. It will either
 * be return to the caller funk or added to the queue.
 * @param  {obj}  _data     -> Raw media data object
 * @param  {map}  _target   -> Target instance
 * @param  {bln} returnVal  -> To be return to caller funk or not
 * @return {---}            -> Return set or add to queue.
 */
const mediaGenerate = function (_data, _target, _keyType, _rawKey) {
  return teFlow.call({
    args: {
      data: _data,
      target: _target,
      rawKey: _rawKey
    }},
    mediaConfig,
    mediaCompose
  );
};

module.exports = mediaGenerate;
