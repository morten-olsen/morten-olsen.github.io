require('reflect-metadata');
require('@babel/register')({
  extensions: [".es6", ".es", ".jsx", ".js", ".mjs", ".ts"],
});
const latex = require("node-latex")
var Readable = require('stream').Readable
const { generateLatex } = require('../../../src/latex');

module.exports = function (source) {
  var callback = this.async();
  const location = this.resourcePath;
  generateLatex(source, location)
    .then((result) => {
      const chunks = [];
      const input = new Readable();
      input.push(result);
      input.push(null);
      const latexStream = latex(input);
      latexStream.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk));
      })
      latexStream.on('finish', () => {
        const result = Buffer.concat(chunks);
        callback(null, result);
      })
      latexStream.on('error', (err) => {
        callback(err);
      })
    })
    .catch(callback);
}
