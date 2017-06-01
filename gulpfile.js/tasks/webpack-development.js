const gulp    = require('gulp');
const webpack = require('webpack');
const path    = require('path');
const nodemon = require('nodemon');
const watch   = require('gulp-watch');
const onBuild = require('./on-build.js');
const paths   = require('../config/index');
const stylus  = require('../config/stylus');
const config  = require('../config/webpack')('dev');
const dest    = paths.publicAssets;

/**
 * Default gulp taske
 */
gulp.task('default', ['run']);


/**
 * Backend Watch
 */
gulp.task('watch', ['backend-watch']);


/**
 * Stylus testBin dir watch
 */
gulp.task('stylus-watch', function() {
  watch(stylus.src, function() { gulp.start('stylus'); });
});


/**
 * Webpack/babel js lib dir watch
 */
gulp.task('backend-watch', function() {
  webpack(config).watch(100, function(err, stats) {
    onBuild()(err, stats);
    nodemon.restart();
  });
});


/**
 * Dev task runner
 */
gulp.task('run', ['backend-watch'], function() {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(dest, '/ctr'),
    ignore: ['*'],
    ext: 'noop'
  }).on('restart', function() {
    console.log('Restarted!');
  });
});
