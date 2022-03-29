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
        test: /\.tex.yml$/,
        use: [{
          loader: 'file-loader', 
          options: {

            publicPath: `${nextConfig.assetPrefix || nextConfig.basePath || ''}/_next/static/images/`,
            outputPath: `${outputPath}static/images/`,
            name: "[name]-[hash].pdf",
            esModule: nextConfig.esModule || false,
          },
        }, {
          loader: require.resolve('./webpack.js'),
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
