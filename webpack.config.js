var path = require("path");
var webpack = require("webpack");

// es5
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

// es6
// module.exports = {
//   entry: {
//     letterApp: './es6js/main-letter-app.js'
//   },
//   output: {
//     path: path.join(__dirname, "./es6dist/js/"),
//     filename: "[name].js",
//     chunkFilename: "[id].js"
//   },
//   module: {
//     loaders: [{
//       test: /\.jsx?$/,
//       exclude: /(node_modules|bower_components)/,
//       loader: 'babel'
//     }]
//   }
// };