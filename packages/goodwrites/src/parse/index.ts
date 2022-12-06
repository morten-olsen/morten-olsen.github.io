import { Block, Document, LengthTarget } from '../types';
import { resolve, dirname } from 'path';
import { readFile } from 'fs-extra';
import remark from 'remark';
import remarkBehead from 'remark-behead';
import visit from 'unist-util-visit';
import readingTime from 'reading-time';

type Options = {
  depth?: number;
  document: Document;
  location: string;
};

type ParseBlockOptions = {
  block: Block | Document;
  location: string;
  path: (string | number)[];
  depth: number;
};

type ReplaceImageOptions = {
  input: string;
  cwd: string;
  fn?: (location: string) => string;
};

type BlockResult = {
  content: string;
  type: 'title' | 'file' | 'meta';
  file?: string;
  stats?: ReturnType<typeof readingTime>;
  state?: Exclude<Block, string>['state'];
  path: (string | number)[];
  length?: LengthTarget;
  cwd: string;
  level?: number;
  notes?: string;
};

const replaceImagesAction = async ({ input, cwd, fn }: ReplaceImageOptions) => {
  const walk = () => (tree: any) => {
    visit(tree, 'image', (node: any) => {
      if (!fn || !node.url.startsWith('./')) {
        return;
      }
      const resolvedLocation = fn(resolve('/', cwd, node.url));
      node.url = resolvedLocation;
    });
  };
  const markdown = String(
    await remark()
      .use(walk as any)
      .process(input)
  );

  return markdown;
};

const partsToArray = (parts: Block | Block[]) => {
  if (Array.isArray(parts)) {
    return parts;
  }
  return [parts];
};

const parseBlock = async ({
  block,
  location,
  path,
  depth,
}: ParseBlockOptions) => {
  const result: BlockResult[] = [];
  if (typeof block === 'string') {
    block = {
      file: block,
    };
  }

  if ('file' in block) {
    const contentDepth = block.title ? depth + 1 : depth;
    const fileLocation = resolve(location, block.file);
    const fileContent = await readFile(fileLocation, 'utf-8');
    const markdown = String(
      await remark()
        .use(remarkBehead, { depth: contentDepth })
        .process(fileContent)
    );
    const title = block.title
      ? ''.padStart(depth + 1, '#') + ' ' + block.title + '\n'
      : '';

    result.push({
      content: `${title}${markdown}`,
      file: fileLocation,
      type: 'file',
      path,
      cwd: dirname(fileLocation),
      level: depth,
      length: block.lenght,
      state: block.state,
      stats: readingTime(markdown),
      notes: block.notes,
    });
  } else if (block.title) {
    result.push({
      content: ''.padStart(depth + 1, '#') + ' ' + block.title,
      type: 'title',
      level: depth,
      cwd: location,
      state: 'state' in block ? block.state : undefined,
      notes: 'notes' in block ? block.notes : undefined,
      path,
    });
    depth += 1;
  } else if ('notes' in block) {
    result.push({
      content: '',
      type: 'meta',
      level: depth,
      cwd: location,
      notes: 'notes' in block ? block.notes : undefined,
      state: block.state,
      path,
    });
  }
  if ('content' in block) {
    const sectionMarkdown = await Promise.all(
      partsToArray(block.content).map((s, index) =>
        parseBlock({
          block: s,
          path: [...path, index],
          location,
          depth,
        })
      )
    );
    result.push(...sectionMarkdown.flat());
  }
  return result;
};

const parseDocument = async ({ document, location, depth = 1 }: Options) => {
  const parts = partsToArray(document.content);
  const parsedParts = await Promise.all(
    parts.map((block, index) =>
      parseBlock({
        block,
        location,
        depth,
        path: [index],
      })
    )
  );
  const partsList = parsedParts.flat();
  const content = partsList.map((p) => p.content).join('\n\n');
  const stats = readingTime(content);
  const files = partsList.map((p) => p.file).filter(Boolean);
  return {
    title: document.title,
    content,
    cover: document.cover,
    cwd: location,
    meta: document.meta,
    stats,
    files,
    original: document,
    parts: partsList,
  };
};

type ToMarkdownOptions = {
  replaceImage?: (location: string) => string;
};

const blockToMarkdown = async (
  block: BlockResult,
  { replaceImage }: ToMarkdownOptions
) => {
  if (replaceImage) {
    return replaceImagesAction({
      input: block.content,
      fn: replaceImage,
      cwd: block.cwd,
    });
  }
  return block.content;
};

const replaceImages = async (
  result: DocumentResult,
  options: ToMarkdownOptions = {}
) => {
  const blocks = await Promise.all(
    result.parts.map(async (block) => ({
      ...block,
      content: await blockToMarkdown(block, options),
    }))
  );

  return {
    ...result,
    parts: blocks,
    content: blocks.map((b) => b.content).join('\n\n'),
  };
};

type DocumentResult = ReturnType<typeof parseDocument> extends Promise<infer U>
  ? U & { pdf?: string }
  : never;

export type { DocumentResult };
export { parseDocument, replaceImages };
