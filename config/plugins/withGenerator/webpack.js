require('reflect-metadata');
require('@babel/register')({
  extensions: [".es6", ".es", ".jsx", ".js", ".mjs", ".ts"],
});
const loaderUtils = require('loader-utils');
const path = require('path');
const yaml = require('yaml');
const { generate } = require('../../../src/generators');

module.exports = function (source) {
  var callback = this.async();
  const location = this.resourcePath;
  const definition = yaml.parse(source);
  const options = this.getOptions();
  generate(definition, location)
    .then((output) => {
      const files = Object.entries(output).reduce((output, [key, value]) => {
        const { name, content } = value;
        const targetName = loaderUtils.interpolateName(this, `[contenthash]/${name}`, {content: content});
        const location = path.join(options.outputPath, targetName);
        const publicPath = path.join(options.publicPath, targetName);
        this.emitFile(location, content);
        return {
          ...output,
          [key]: publicPath,
        }
      }, {});
      callback(null, `module.exports = ${JSON.stringify(files)}`);
    })
    .catch(callback);
}
