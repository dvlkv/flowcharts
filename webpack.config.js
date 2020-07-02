const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let isProduction = process.env.NODE_ENV === 'production';

let rules = [];

// typescript
rules.push({
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
});
rules.push({
  enforce: "pre",
  test: /\.js$/,
  loader: "source-map-loader"
});

// styles
rules.push({
  test: /\.(less|css)$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
});

// assets
rules.push({
  test: /\.(svg|png)/,
  type: 'asset/resource'
});
rules.push({
  test: /\.(eot|otf|ttf|woff2?)/,
  type: 'asset/resource',
  generator: {
    filename: 'static/fonts/[hash][ext]'
  }
});

module.exports = {
  entry: {
    app:  path.join(__dirname, 'packages', 'algorithmer-app', 'index.tsx')
  },
  target: 'web',
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: rules,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.less'],
    alias: {
      "createElement": "h"
    }
  },
  plugins: [
    new CleanWebpackPlugin(), // clears dist when dev server is running
    new HtmlWebpackPlugin({ // generates html with substituted hash
      title: 'Loading...',
      template: 'packages/algorithmer-app/index.html',
      inject: true,
      minify: isProduction
    }),
    new MiniCssExtractPlugin({ // extracts css to chunk files
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