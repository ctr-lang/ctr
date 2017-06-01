const gulp    = require('gulp');
const webpack = require('webpack');
const onBuild = require('./on-build.js');
const config  = require('../config/webpack')('production');

/**
 * Build her as high as the moon
 */
gulp.task('build', [
  'backend-build'
]);


/**
 * Builds lib
 */
gulp.task('backend-build', function(done) {
  webpack(config).run(onBuild(done));
});
