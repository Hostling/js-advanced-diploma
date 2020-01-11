const path = require('path');

module.exports = {
  entry: {
    app: './src/index.js'
  },
 output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: '/node_modules/'
    },
    {
      test: /\.(png|jpg|gif)$/i,
      use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
    },
    {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }]
  }
}
