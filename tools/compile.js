import gutil from 'gutil';
import webpack from 'webpack';

import webpackConfig from './webpack.base.conf';
import genWebpack from './dealWebpackConfig'

// console.log(process.argv)

function run() {
  console.log('compiling');
  const compiler = webpack(genWebpack(webpackConfig, 'build'));
  compiler.run((err, stats) => {
    gutil.log('[webpack:build]', stats.toString({
      chunks: false, // Makes the build much quieter
      colors: true,
    }));
  });
}

run();
