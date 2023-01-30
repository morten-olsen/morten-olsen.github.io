
exports.withImages = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    nextConfig = Object.assign(
      { inlineImageLimit: false, assetPrefix: "" },
      nextConfig
    );

    const { isServer, dev } = options;
    let outputPath = "";
    if (isServer && dev) {
      outputPath = "../";
    } else if (isServer) {
      outputPath = "../../";
    }

    config.module.rules.push({
      test: /\.(jpe?g|png|gif|ico|webp|jp2|url|svg)$/,
      // Next.js already handles url() in css/sass/scss files
      // issuer: /\.\w+(?<!(s?c|sa)ss)$/i, // commented out because of a bug with require.context load https://github.com/webpack/webpack/issues/9309
      use: [
        {
          loader: require.resolve("responsive-loader"),
          options: {
            limit: nextConfig.inlineImageLimit,
            fallback: require.resolve("file-loader"),
            publicPath: `${
              nextConfig.assetPrefix || nextConfig.basePath || ""
            }/_next/static/images/`,
            outputPath: `${outputPath}static/images/`,
            name: "[name]-[hash].[ext]",
            esModule: nextConfig.esModule || false,
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

