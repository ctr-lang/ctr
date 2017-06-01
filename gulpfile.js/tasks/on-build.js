
/**
 * Wrapper for webpack gulp build precess
 * @param  {cb} done
 */
const onBuild = function (done) {
  return function(err, stats) {
    if (err) {
      console.error('Error', err);
    }else {
      console.log(stats.toString({
        cached: false,
        cachedAssets: false,
        chunks: true,
        maxModules: Infinity,
        colors: true,
        performance: false,
        version: false,
        warnings: true
      }));
    }
    if (done) {
      done();
    }
  };
};

module.exports = onBuild;
