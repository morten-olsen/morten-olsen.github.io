import fs from 'fs-extra';
import path from 'path';
import behead from 'remark-behead';
import remark from 'remark';
import visit from 'unist-util-visit';
import { AssetResolver } from '../assets';

type MarkdownSection = string | {
  title?: string;
  file?: string;
  notes?: string;
  parts?: MarkdownSection[];
};

const replaceImages = ({ location, assets }: any) => (tree: any) => {
  visit(tree, 'image', (node: any) => {
    if (!node.url.startsWith('./')) return;
    const resolvedLocation = assets.getPath(
      path.resolve('/', location, node.url),
    );
    node.url = resolvedLocation;
  })
};

const generate = async (
  location: string,
  section: MarkdownSection,
  depth: number,
  assets: AssetResolver,
) => {
  const result: string[] = [];
  if (typeof section === 'string') {
    section = {
      file: section,
    };
  }
  if (section.title) {
    result.push(''.padStart(depth, '#') + ' ' + section.title);
    depth += 1;
  }
  if (section.file) {
    const fileLocation = path.resolve('content', location, section.file);
    const fileContent = await fs.readFile(fileLocation, 'utf-8');
    const markdown = String(
      await remark()
        .use(behead, { depth })
        .use(replaceImages, { location, assets }).process(fileContent),
    );
    result.push(markdown);
  }
  if (section.parts) {
    const sectionMarkdown = await Promise.all(
      section.parts.map(s => generate(
        location,
        s,
        depth + 1,
        assets,
      )),
    );
    result.push(...sectionMarkdown);
  }
  return result.join('\n\n');
}

export type { MarkdownSection };
export { generate };
