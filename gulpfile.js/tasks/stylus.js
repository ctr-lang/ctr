const gulp         = require('gulp');
const stylus       = require('gulp-stylus');
const handleErrors = require('../lib/handleErrors');
const config       = require('../config/stylus');

gulp.task('stylus', function () {
  const CTR = require('ctr').stylus;
  const ctr = new CTR();
  return gulp.src(config.src)
  .pipe(stylus({
    use: [ctr]
  }))
  .on('error', handleErrors)
  .pipe(gulp.dest(config.dest));
});

