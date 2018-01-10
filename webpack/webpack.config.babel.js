import webpack from 'webpack'
import path from 'path'

const srcPath = path.join(__dirname, '..', 'src')
const outputFile = 'index.js'

export default {
  devtool: 'inline-source-map',
  entry: path.join(srcPath, 'index.js'),
  output: {
    path: path.resolve(__dirname, '..', 'dist'),
    filename: outputFile,
    library: 'trinity-plugin-api',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    //publicPath
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        include: srcPath,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    modules: [
      srcPath,
      'node_modules'
    ],
    extensions: ['.json', '.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
}
