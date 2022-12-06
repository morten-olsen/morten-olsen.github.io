exports.withMarkdown = (nextConfig = {}) => ({
  ...nextConfig,
  webpack(config, options) {
    config.module.rules.push({
      test: /\.md$/,
      use: [
        {
          loader: require.resolve("@morten-olsen/markdown-loader"),
        },
      ],
    });
    if (typeof nextConfig.webpack === "function") {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});
