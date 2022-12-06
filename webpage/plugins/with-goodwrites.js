exports.withGoodwrites = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    const { isServer, dev } = options;
    let outputPath = "";
    if (isServer && dev) {
      outputPath = "../";
    } else if (isServer) {
      outputPath = "../../";
    }
    config.module.rules.push({
      test: /article.yml$/,
      use: [
        {
          loader: require.resolve("@morten-olsen/goodwrites-webpack-loader"),
          options: {
            publicPath: `${
              nextConfig.assetPrefix || nextConfig.basePath || ""
            }/_next/static/assets/`,
            outputPath: `${outputPath}static/assets/`,
          },
        },
      ],
    });
    if (typeof nextConfig.webpack === "function") {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});
