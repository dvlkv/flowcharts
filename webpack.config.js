const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app:  path.join(__dirname, 'packages', 'algorithmer-app', 'index.tsx')
  },
  target: 'web',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-env',
            ],
            plugins: [
              ["transform-react-jsx", { pragma: "h", pragmaFrag: "Fragment" }],
              ['babel-plugin-jsx-pragmatic', {
                module: 'preact',
                import: 'h',
                export: 'h',
              }],
            ]
          }
        }],
        exclude: /node_modules/,
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        // Transform our own .(less|css) files with PostCSS and CSS-modules
        test: /\.(less|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.less'],
    alias: {
      "createElement": "h"
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Loading...',
      template: 'packages/algorithmer-app/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    })
  ],
  optimization: {
    minimizer: [new UglifyJsPlugin()],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    compress: true,
    port: 9000
  },
};