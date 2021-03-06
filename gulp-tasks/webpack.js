import path from 'path'
import webpack from 'webpack'
import process from 'process'
import WriteFilePlugin from 'write-file-webpack-plugin'

const isProduction = process.env.NODE_ENV === 'production'

let config = {
  mode: isProduction ? 'production' : 'development',
  entry: isProduction
    ? {
        main: './js/src/app.js',
      }
    : {
        main: [
          './js/src/app.js',
          'webpack/hot/dev-server',
          'webpack-hot-middleware/client',
        ],
      },

  output: {
    filename: './js/main.bundle.js',
    path: path.resolve(__dirname, '../assets'),
    publicPath: path.resolve(__dirname, '../assets'),
  },

  context: path.resolve(__dirname, '../assets'),

  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [
            [
              'latest',
              {
                modules: false,
              },
            ],
          ],
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  plugins: isProduction
    ? [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"production"',
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new WriteFilePlugin({
          test: /^(?!.*(hot)).*/,
        }),
      ]
    : [
        new webpack.HotModuleReplacementPlugin(),
        new WriteFilePlugin({
          test: /^(?!.*(hot)).*/,
        }),
      ],
}

function scripts() {
  return new Promise((resolve) =>
    webpack(config, (err, stats) => {
      if (err) console.log('Webpack', err)

      console.log(
        stats.toString({
          /* stats options */
        })
      )

      resolve()
    })
  )
}

module.exports = {
  config,
  scripts,
}
