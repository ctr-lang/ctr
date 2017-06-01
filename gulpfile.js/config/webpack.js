const fs            = require('fs');
const path          = require('path');
const paths         = require('./');
const webpack       = require('webpack');
const nodeExternals = require('webpack-node-externals');

/**
 * Generates webpack config for watcher
 * @param  {str} env -> run enviroment
 * @return {obj}     -> config
 */
const genConfig = function (env) {
  const dev = env !== 'production';
  const dest = paths.publicAssets;
  return {
    entry: {
      ctr: './lib/ctr.js'
    },
    devtool: dev ? '#eval-source-map' : 'source-map',
    stats: 'verbose',
    target: 'node',
    node: {
      __dirname: false,
      __filename: true
    },
    output: {
      path: path.resolve(dest),
      filename: '[name].js',
      library: '[name]',
      libraryTarget: 'umd'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }]
    },
    externals: [nodeExternals()],
    plugins: dev ? [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.LoaderOptionsPlugin({debug: true})
    ] : [
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new webpack.BannerPlugin({
        banner: '\n\n/* eslint-disable */\n',
        raw: true
      }),
      new webpack.BannerPlugin(fs.readFileSync(path.join(process.cwd(), './LICENSE.txt'), 'utf8')),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      })
    ]
  };
};


module.exports = genConfig;
