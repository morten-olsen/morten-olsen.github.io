const withPlugins = require("next-compose-plugins");

const withImages = require("./config/plugins/withImages.js");
const withLatex = require('./config/plugins/withLatex');
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  poweredByHeader: false,
  images: {
    disableStaticImages: true
  }
};

module.exports = withPlugins([
  withLatex,
  [withImages,{
    esModule: true, // using ES modules is beneficial in the case of module concatenation and tree shaking.
    inlineImageLimit: 0, // disable image inlining to data:base64
  }],
  withBundleAnalyzer,
], nextConfig);
