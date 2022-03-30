const withPlugins = require("next-compose-plugins");

const withImages = require("./config/plugins/withImages.js");
const withGenerator = require('./config/plugins/withGenerator');
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

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
  withGenerator,
  [withImages,{
    esModule: true, // using ES modules is beneficial in the case of module concatenation and tree shaking.
    inlineImageLimit: 0, // disable image inlining to data:base64
  }],
  withBundleAnalyzer,
], nextConfig);
