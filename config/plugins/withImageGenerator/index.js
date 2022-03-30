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
        test: /\.png.yml$/,
        use: [{
          loader: 'file-loader', 
          options: {

            publicPath: `${nextConfig.assetPrefix || nextConfig.basePath || ''}/_next/static/images/`,
            outputPath: `${outputPath}static/images/`,
            name: (name) => {
              const fileName = path.basename(name);
              const parts = fileName.split('.');
              parts.pop();
              const ext = parts.pop();

              return `${parts.join('.')}.[hash].${ext}`;
            },
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
