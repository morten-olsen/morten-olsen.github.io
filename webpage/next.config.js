const withPlugins = require("next-compose-plugins");
const { withImages } = require('./plugins/with-images');
const { withGoodwrites } = require('./plugins/with-goodwrites');
const { withMarkdown } = require('./plugins/with-markdown');

const nextConfig = {
  poweredByHeader: false,
  images: {
    disableStaticImages: true
  },
  experimental: {
    concurrentFeatures: true,
  },
};

module.exports = withPlugins([
  withImages,
  withGoodwrites,
  withMarkdown,
], nextConfig);
