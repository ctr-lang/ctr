const config = {};

config.publicDirectory = './dist';
config.sourceDirectory = './lib';
config.testDirectory   = './__tests__';
config.publicAssets    = config.publicDirectory + '/';
config.sourceAssets    = config.sourceDirectory + '/';
config.publicTemp      = config.publicDirectory + '/.temp';

module.exports = config;
