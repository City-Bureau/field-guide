import webpack from "webpack";
import path from "path";

export default {
  target: "web",
  mode: "development",
  entry: {
    app: ["./js/app"],
    cms: ["./js/cms/index"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=/[hash].[ext]"
      },
      {test: /\.json$/, loader: "json-loader"},
      {
        loader: "babel-loader",
        test: /\.js?$/,
        exclude: /node_modules/,
        query: {cacheDirectory: true}
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      fetch:
        "imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch"
    }),
  ],
  context: path.join(__dirname, "src"),
  externals: [/^vendor\/.+\.js$/],
  watchOptions: {
    poll: true,
  },
};
