import path from 'path';

export default {
  // mode: 'production',
  mode: 'development',
  target: 'node',
  externals:['html-webpack-plugin'],
  entry: ['./src/index.js'],
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: 'VersiongitWebpackPlugin.min.js',
    path: path.resolve(process.cwd(), 'dist'),
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
        include: [
          path.resolve('src'),
        ],
      }
    ],
  },
  plugins: [
    // new VersionWebpackPlugin({
    //   package_url: path.resolve(__dirname, '../package.json')
    // }),
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, "../test-html/index.html")
    // })
  ],
};
