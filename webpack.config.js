const path = require('path')
const webpack = require('webpack')
const LiveReloadPlugin = require('webpack-livereload-plugin')

const NODE_ENV = process.env.NODE_ENV || 'development'
const IS_TEST = (NODE_ENV === 'test')

const clientDir = path.resolve(__dirname, 'client')
const publicDir = path.resolve(__dirname, 'public')
const excludeDirs = /(node_modules|bower_components)/

const config = {
  entry: [
    'script!jquery/dist/jquery.min.js',
    // 'script!foundation-sites/dist/foundation.min.js',
    'script!tether/dist/js/tether.min.js',
    'script!bootstrap/dist/js/bootstrap.min.js',
    clientDir + '/app.js',
  ],
  externals: {
    jquery: 'jQuery'
  },
  output: {
    path: publicDir,
    filename: 'dist/bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: excludeDirs,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      }, {
        test: /\.html$/,
        loader: 'raw',
        exclude: excludeDirs
      }, {
        test: /\.css$/,
        loader: 'style!css',
        // loader: 'style!css!postcss',
        exclude: excludeDirs
      }, {
        test: /\.scss$/,
        loader: 'style!css!sass',
        exclude: excludeDirs
      }, {
        test: /\.(gif|png|jpg|svg|ttf|eot|woff|woff2)(\?\S*)?$/,
        // loader: 'url?name=[path][name].[ext]',
        loader: 'url?limit=100000&name=[name].[ext]',
        // exclude: excludeDirs
      }
    ]
  },
  // postcss: function () {
  //   return [
  //     // require('autoprefixer')({ browsers: ['last 2 versions'] }),
  //     // require('autoprefixer'),
  //     require('precss'),
  //     require('postcss-cssnext'),
  //   ]
  // },
  devServer: {
    host: 'localhost',
    port: 8080,
    contentBase: publicDir,
    // proxy: {
    //   '*': 'http://localhost:3000'
    // }
  }
}

config.plugins.push(new LiveReloadPlugin())

config.plugins.push(new webpack.ProvidePlugin({$: 'jquery', jQuery: 'jquery'}))

config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify(NODE_ENV),
    'IS_TEST': IS_TEST,
  }
}))

if (NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }))
  config.plugins.push(new webpack.optimize.OccurenceOrderPlugin(), new webpack.optimize.DedupePlugin())
  config.devtool = 'source-map'
}

module.exports = config
