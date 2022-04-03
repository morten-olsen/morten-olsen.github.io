const path = require('path');
const withLatex = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      const {isServer, dev} = options;
      let outputPath = '';
      if (isServer && dev) {
        outputPath = "../";
      } else if (isServer) {
        outputPath = "../../";
      }
      config.module.rules.push({
        test: /\.gen.yml$/,
        use: [{
          loader: require.resolve('./webpack.js'),
          options: {
            isDev: dev,
            publicPath: `${nextConfig.assetPrefix || nextConfig.basePath || ''}/_next/static/assets/`,
            outputPath: `${outputPath}static/assets/`,
          },
        }],
      });
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
}

module.exports = withLatex;
