import * as webpack from 'webpack';
import fm from 'front-matter';

function webpackLoader(
  this: webpack.LoaderContext<{}>,
  contents: string = ''
) {
  const callback = this.async();

  const run = async () => {
    const { attributes, body } = fm(contents);
    return {
      attributes,
      body,
    };
  };

  run()
    .then((content) => {
      callback(null, `module.exports=${JSON.stringify(content)}`);
    })
    .catch((error) => {
      callback(error);
    });
}

export { webpackLoader };
