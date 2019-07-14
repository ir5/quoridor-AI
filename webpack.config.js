const path = require('path');

module.exports = {
  entry: {
    main: './src/main.ts',
    worker: './src/agent.worker.ts'
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "[name].js",
    library: "[name]",
    // libraryTarget: "umd"
    // filename: 'main.js'
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
