const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    app:  path.join(__dirname, 'packages', 'algorithmer-app', 'index.tsx')
  },
  target: 'web',
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-typescript',
              '@babel/preset-env'
            ],
            plugins: [
              ["transform-react-jsx", { pragma: "h", pragmaFrag: "Fragment" }],
              ['babel-plugin-jsx-pragmatic', {
                module: 'preact',
                import: 'h',
                export: 'h',
              }],
              ["@babel/plugin-proposal-class-properties"]
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
        test: /\.(less|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
      },
      {
        test: /\.(svg|png)/,
        type: 'asset/resource'
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
      template: 'packages/algorithmer-app/index.html',
      inject: true
    }),
    new MiniCssExtractPlugin({
      filename: isProduction ? '[contenthash].css' : '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    })
  ],
  optimization: {
    minimize: isProduction,
    minimizer: [new TerserPlugin()],
  },
  output: {
    filename: isProduction ? '[contenthash].js' : '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'static/[name].[hash][ext]'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    compress: true,
    port: 9000
  },
  experiments: {
    asset: true
  }
};