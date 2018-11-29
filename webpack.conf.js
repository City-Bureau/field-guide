const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  target: "web",
  devtool: "source-map",
  mode: "development",
  entry: {
    app: ["es6-shim", "babel-polyfill", path.resolve("./src/entry")],
    cms: [path.resolve("./src/js/cms/index")]
  },
  output: {
    path: path.resolve("./dist/assets"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        loader: "babel-loader",
        test: /\.jsx?$/,
        exclude: /node_modules/,
        query: {cacheDirectory: true}
      },
      {
        test: /\.(sass|scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
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
    new MiniCssExtractPlugin({filename: "[name].css"}),
    new webpack.ProvidePlugin({
      fetch:
        "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
    })
  ],
  watchOptions: {
    poll: true
  }
};

module.exports = config;
