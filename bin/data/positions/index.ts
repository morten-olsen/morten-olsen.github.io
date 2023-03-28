import { createGlob } from '../../resources/glob';
import { createFile } from '../../resources/file';
import grayMatter from 'gray-matter';
import { Bundler } from '../../bundler';
import { markdownBundleImages } from '../../utils/markdown';
import { dirname } from 'path';
import { Position } from '../../../types';
import { Observable } from '../../observable';

type PositionOptions = {
  cwd: string;
  pattern: string;
  bundler: Bundler;
};

const createPositions = ({ cwd, pattern, bundler }: PositionOptions) => {
  const files = createGlob<Observable<Position>>({
    pattern,
    cwd,
    create: (path) => {
      console.log('c', path);
      const file = createFile({ path });
      const position = file.pipe(async (raw) => {
        const { data, content } = grayMatter(raw);
        const { title } = data;
        const cwd = dirname(path);
        const markdown = await markdownBundleImages({
          cwd,
          content,
          bundler,
        });
        const result = {
          company: data.company,
          title,
          from: data.from,
          to: data.to,
          raw: content,
          content: markdown,
        } as any;
        return result;
      });
      return position;
    },
  });

  return files;
};

export { createPositions };
