import gutil from 'gutil';
import webpack from 'webpack';

import webpackConfig from './webpack.base.conf';
import genWebpack from './dealWebpackConfig'

// console.log(process.env.npm_config_argv)

function run() {
  console.log('compiling-f-demo');
  const compiler = webpack(genWebpack(webpackConfig, 'demo'));
  compiler.run((err, stats) => {
    gutil.log('[webpack:demoFWeb]', stats.toString({
      chunks: false, // Makes the build much quieter
      colors: true,
    }));
  });
}

run();
