const path = require('path');
const slsw = require('serverless-webpack');

const commonConfig = {
  // mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  // entry: slsw.lib.entries,  
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(process.cwd(), '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
    ],
  },
};


module.exports = Object.assign(commonConfig, {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
});
