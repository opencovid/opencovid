const { resolve } = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cssLoaders =
  [
    {
      loader: 'css-loader',
      options: { importLoaders: 1 }
    }
  ];

let config = {
  entry: resolve('./src/Covid.js'),
  mode: 'production',
  watch: false,
  output: {
    path: resolve('./dist'),
    filename: 'bundle.min.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      resolve('./node_modules'),
      resolve('./src')
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssLoaders
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [...cssLoaders, "sass-loader"]
        })
      },
      {
        test: /\.(woff2?|eot|ttf|otf|wav)(\?.*)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(png|svg|jpe?g|gif)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: { 
              limit: 8192, 
              outputPath: "./src/assets/images/"
            }
          },
          {
            loader: "img-loader",
            options: { 
              enabled: false,
              outputPath: "./src/assets/images/"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'stylesheets/application.min.css',
      disable: true
    }),
  ],
  devServer: {
    contentBase: resolve("./"),
    compress: true,
    historyApiFallback: true,
    port: 3210
  }
};

module.exports = config
