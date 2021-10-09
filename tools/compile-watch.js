import gutil from 'gutil';
import webpack from 'webpack';

import webpackConfig from './webpack.base.conf';
import genWebpack from './dealWebpackConfig'

function run() {
  console.log('compiling');
  const compiler = webpack(genWebpack(webpackConfig, 'watch'));
  compiler.watch({}, (err, stats) => {
    gutil.log('[webpack:build]', stats.toString({
      chunks: false, // Makes the build much quieter
      colors: true,
    }));
  });
}

run();
