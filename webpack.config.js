var path = require('path');
module.exports = {
  entry: './dist/app/index.js',
  output: {
    filename: './bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};