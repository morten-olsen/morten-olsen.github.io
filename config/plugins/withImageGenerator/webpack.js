require('reflect-metadata');
require('@babel/register')({
  extensions: [".es6", ".es", ".jsx", ".js", ".mjs", ".ts"],
});
const { generateImage } = require('../../../src/images');

module.exports = function (source) {
  var callback = this.async();
  const location = this.resourcePath;
  generateImage(source, location)
    .then((canvas) => {
      const buffer = canvas.toBuffer('image/png', {})
      callback(null, buffer);
    })
    .catch(callback);
}
