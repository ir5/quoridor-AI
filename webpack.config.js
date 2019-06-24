const path = require('path');

module.exports = {
  entry: {
    bundle: './src/main.ts'
  },  
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js'
  },
  resolve: {
    extensions:['.ts', '.js']
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  module: {
    rules: [
    {
      test:/\.ts$/, loader:'ts-loader'
    }
    ]
  }
}
