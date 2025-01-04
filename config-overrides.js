const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve = {
    ...config.resolve,
    fallback: {
      "crypto": require.resolve("crypto-browserify"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "http": require.resolve("stream-http"),
      "buffer": require.resolve("buffer/"),
      "stream": require.resolve("stream-browserify"),
      "process": false,
      "util": require.resolve("util/"),
      "assert": require.resolve("assert/")
    }
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser'
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ];

  return config;
}; 