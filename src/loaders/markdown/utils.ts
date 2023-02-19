import remark from 'remark';
import sharp from 'sharp';
import { resolve } from 'path';
import { Bundler } from '../../bundler';
import { imageLoader } from '../image';

type ReplaceImagesOptions = {
  cwd: string;
  content: string;
  format?: keyof sharp.FormatEnum;
}

const visit = async (node: any, options: ReplaceImagesOptions, bundler: Bundler) => {
  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      await visit(child, options, bundler);
    }
  }
  if (node.type === 'image') {
    const location = resolve(options.cwd, node.url);
    const { src } = await bundler.use(imageLoader({
      content: location,
      format: options.format || 'webp',
    }));
    node.url = src
  }
}

const replaceImages = async (bundler: Bundler, options: ReplaceImagesOptions) => {
  const markdown = String(
    await remark()
      .use(() => (tree, file, next) => {
        visit(tree, options, bundler).then(() => {
          next!(null, tree, file);
        });
      })
      .process(options.content)
  );

  return markdown;
};

export type { ReplaceImagesOptions };
export { replaceImages };
