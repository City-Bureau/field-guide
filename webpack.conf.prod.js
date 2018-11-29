const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");

const config = {
  target: "web",
  devtool: "source-map",
  mode: "production",
  entry: {
    app: ["es6-shim", "babel-polyfill", path.resolve("./src/entry")],
    cms: [path.resolve("./src/js/cms/index")]
  },
  output: {
    path: path.resolve("./dist/assets"),
    // eslint-disable-next-line
    filename: chunkData =>
      chunkData.chunk.name === "cms" ? "[name].js" : "[name].[contenthash].js"
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              // eslint-disable-next-line
              plugins: () => [require("autoprefixer")]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=/[hash].[ext]"
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({filename: "[name].[contenthash].css"}),
    new webpack.ProvidePlugin({
      fetch:
        "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
    }),
    new ManifestPlugin({
      fileName: "../../site/data/manifest.json"
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx"]
  },
  watchOptions: {
    poll: true
  }
};

module.exports = config;
