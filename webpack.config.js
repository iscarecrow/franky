var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: {
    letterApp: './js/main-letter-app.js'
  },
  output: {
    path: path.join(__dirname, "./dist/js/"),
    filename: "[name].js",
    chunkFilename: "[id].js"
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel'
    }]
  }
};