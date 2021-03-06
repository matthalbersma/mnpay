var webpack = require("webpack");
const TRAVIS = process.env.TRAVIS ? JSON.parse(process.env.TRAVIS) : false
const DEBUG = process.env.SERVER_ENV !== "production" && !TRAVIS;

var plugins = DEBUG ? [] : [
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false}),
]
if (TRAVIS) {
  plugins.push(new webpack.NoErrorsPlugin());
}

if (!DEBUG) {
  console.log("Building for production")
}

module.exports = {
  bail: TRAVIS,
  context: __dirname + "/app",
  devtool: DEBUG ? "inline-sourcemap" : null,
  entry: "/client/js/client.js",
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-0'],
          plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy']
        }
      }
    ]
  },
  output: {
    path: "/static/js",
    filename: "client.min.js"
  },
  plugins: plugins,
};
