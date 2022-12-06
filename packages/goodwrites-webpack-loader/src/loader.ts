import * as webpack from 'webpack';
import * as loaderUtils from 'loader-utils';
import {
  replaceImages,
  Document,
  parseDocument,
} from '@morten-olsen/goodwrites';
import { join, dirname, basename } from 'path';
import yaml from 'yaml';
import { readFileSync } from 'fs-extra';
import { toPdf } from '@morten-olsen/goodwrites-latex';
import slugify from 'slugify';

type LoaderOptions = {
  publicPath?: string;
  outputPath?: string;
};

function webpackLoader(
  this: webpack.LoaderContext<LoaderOptions>,
  contents: string = ''
) {
  const options: LoaderOptions = this.getOptions();
  const publicPath =
     options.publicPath ?? '';
  const outputPath =
     options.outputPath ?? this._compilation?.outputOptions.path ?? '';

  const callback = this.async();
  const source = this.resourcePath;

  const run = async () => {
    const document: Document = yaml.parse(contents);
    const slug = slugify(document.title, { lower: true });
    const addFile = (fileLocation: string) => {
      const content = readFileSync(fileLocation);
      const filename = basename(fileLocation);
      const targetName = loaderUtils.interpolateName(
        this as any,
        `/goodwrite/${slug}/[hash]-${filename}`,
        {
          content,
        }
      );
      const targetLocation = targetName;
      this.emitFile(join(outputPath, targetLocation), content);
      this.addDependency(fileLocation);
      return join(publicPath, targetName);
    };
    const location = dirname(source);
    const parsed = await parseDocument({
      document,
      location,
    });
    const markdown = await replaceImages(parsed, {
      replaceImage: (image) => {
        return addFile(image);
      }
    });
    if (markdown.cover) {
      markdown.cover = await addFile(join(location, markdown.cover));
    }
    const pdf = await toPdf(parsed);
    const pdfName = loaderUtils.interpolateName(
      this as any,
      `/goodwrite/[hash]/${slug}.pdf`,
      {
        content: pdf,
      }
    );
    this.emitFile(join(outputPath, pdfName), pdf);
    return {
      ...markdown,
      pdf: join(publicPath, pdfName),
    };
  };

  run()
    .then((content) => {
      content.files.forEach((file) => (file ? this.addDependency(file) : null));
      callback(null, `module.exports=${JSON.stringify(content)}`);
    })
    .catch((error) => {
      callback(error);
    });
}

export { webpackLoader };
