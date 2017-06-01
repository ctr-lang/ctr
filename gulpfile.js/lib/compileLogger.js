const gutil        = require('gulp-util');
const prettifyTime = require('./prettifyTime');
const handleErrors = require('./handleErrors');

module.exports = function(err, stats) {
  if(err) { throw new gutil.PluginError('webpack', err); }

  let statColor = stats.compilation.warnings.length < 1 ? 'green' : 'yellow';

  if(stats.compilation.errors.length > 0) {
    stats.compilation.errors.forEach(function(error){
      handleErrors(error);
      statColor = 'red';
    });
  } else {
    const compileTime = prettifyTime(stats.endTime - stats.startTime);
    gutil.log(gutil.colors[statColor](stats));
    gutil.log('Compiled with', gutil.colors.cyan('webpack:development'), 'in', gutil.colors.magenta(compileTime));
  }
};
