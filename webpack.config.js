const path = require('path');

module.exports = {
  entry: './src/background.js', // Update this path to point to your background script
  output: {
    filename: 'background.bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production', // or 'development'
};
