import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import remarkStringify from 'remark-stringify';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeShiki from '@shikijs/rehype';
import { visit, SKIP } from 'unist-util-visit';
import { toString as hastToString } from 'hast-util-to-string';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import type { Root as MdastRoot, Paragraph, Image as MdastImage } from 'mdast';
import type { Root as HastRoot, Element as HastElement, ElementContent } from 'hast';
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive';

type Heading = { depth: number; text: string; slug: string };

const imageModules = import.meta.glob<ImageMetadata>(
  '/src/content/posts/**/*.{png,jpg,jpeg,gif,webp,avif,svg}',
  { eager: true, import: 'default' },
);

const resolveAssetPath = (postId: string, src: string): string | undefined => {
  if (!src.startsWith('./') && !src.startsWith('../')) return undefined;
  const base = `/src/content/posts/${postId}`;
  const segments = `${base}/${src}`.split('/');
  const stack: string[] = [];
  for (const seg of segments) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') stack.pop();
    else stack.push(seg);
  }
  return '/' + stack.join('/');
};

const resolveImage = (postId: string, src: string): ImageMetadata | undefined => {
  const key = resolveAssetPath(postId, src);
  if (!key) return undefined;
  return imageModules[key];
};

const IMAGE_WIDTHS = [400, 700, 1000];
const IMAGE_SIZES = '(max-width: 768px) 100vw, 700px';

const KNOWN_DIRECTIVES = new Set(['bot']);

const remarkUnknownDirectivesToText = () => (tree: MdastRoot) => {
  visit(tree, (node, index, parent) => {
    if (!parent || typeof index !== 'number') return;
    if (
      node.type !== 'textDirective' &&
      node.type !== 'leafDirective' &&
      node.type !== 'containerDirective'
    ) {
      return;
    }
    const directive = node as TextDirective | LeafDirective | ContainerDirective;
    if (KNOWN_DIRECTIVES.has(directive.name)) return;
    if (node.type === 'containerDirective') {
      parent.children.splice(index, 1, ...directive.children);
      return [SKIP, index];
    }
    parent.children[index] = { type: 'text', value: ':' + directive.name };
    return [SKIP, index];
  });
};

const remarkBotForHtml = () => (tree: MdastRoot) => {
  visit(tree, (node) => {
    if (node.type !== 'containerDirective') return;
    const directive = node as ContainerDirective;
    if (directive.name !== 'bot') return;

    const title = directive.attributes?.title;
    directive.data ??= {};
    directive.data.hName = 'div';
    directive.data.hProperties = { className: ['bot-message'] };

    const wrapper: Paragraph = {
      type: 'paragraph',
      data: {
        hName: 'div',
        hProperties: { className: ['bot-content'] },
      },
      children: directive.children as Paragraph['children'],
    };

    if (title) {
      const header: Paragraph = {
        type: 'paragraph',
        data: {
          hName: 'div',
          hProperties: { className: ['bot-header'] },
        },
        children: [{ type: 'text', value: title }],
      };
      directive.children = [header, wrapper] as ContainerDirective['children'];
    } else {
      directive.children = [wrapper] as ContainerDirective['children'];
    }
  });
};

const remarkBotForMarkdown = () => (tree: MdastRoot) => {
  visit(tree, (node, index, parent) => {
    if (node.type !== 'containerDirective') return;
    const directive = node as ContainerDirective;
    if (directive.name !== 'bot') return;
    if (!parent || typeof index !== 'number') return;

    const title = directive.attributes?.title;
    const headerChildren = title
      ? [
          {
            type: 'paragraph' as const,
            children: [
              {
                type: 'strong' as const,
                children: [{ type: 'text' as const, value: title }],
              },
            ],
          },
        ]
      : [];

    parent.children[index] = {
      type: 'blockquote',
      children: [...headerChildren, ...directive.children] as never,
    };
  });
};

const rehypeUnwrapImageParagraphs = () => (tree: HastRoot) => {
  visit(tree, 'element', (node, index, parent) => {
    if (node.tagName !== 'p' || !parent || typeof index !== 'number') return;
    const meaningful = node.children.filter(
      (c) => !(c.type === 'text' && /^\s*$/.test(c.value)),
    );
    if (
      meaningful.length === 1 &&
      meaningful[0].type === 'element' &&
      meaningful[0].tagName === 'img'
    ) {
      parent.children[index] = meaningful[0] as ElementContent;
      return [SKIP, index];
    }
  });
};

const rehypeContentImages = (postId: string) => () =>
  async (tree: HastRoot) => {
    const tasks: Promise<void>[] = [];
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'img' || !parent || typeof index !== 'number') return;
      tasks.push(replaceImage(node, postId, parent, index));
    });
    await Promise.all(tasks);
  };

const replaceImage = async (
  node: HastElement,
  postId: string,
  parent: HastRoot | HastElement,
  index: number,
) => {
  const rawSrc = node.properties?.src;
  if (typeof rawSrc !== 'string') return;
  const meta = resolveImage(postId, rawSrc);
  if (!meta) return;

  const alt = typeof node.properties?.alt === 'string' ? node.properties.alt : '';
  const title = typeof node.properties?.title === 'string' ? node.properties.title : undefined;

  const [avif, webp, fallback] = await Promise.all([
    getImage({ src: meta, widths: IMAGE_WIDTHS, format: 'avif' }),
    getImage({ src: meta, widths: IMAGE_WIDTHS, format: 'webp' }),
    getImage({ src: meta, widths: IMAGE_WIDTHS }),
  ]);

  const sourceAvif: HastElement = {
    type: 'element',
    tagName: 'source',
    properties: {
      type: 'image/avif',
      srcset: avif.srcSet?.attribute || avif.src,
      sizes: IMAGE_SIZES,
    },
    children: [],
  };
  const sourceWebp: HastElement = {
    type: 'element',
    tagName: 'source',
    properties: {
      type: 'image/webp',
      srcset: webp.srcSet?.attribute || webp.src,
      sizes: IMAGE_SIZES,
    },
    children: [],
  };
  const fallbackImg: HastElement = {
    type: 'element',
    tagName: 'img',
    properties: {
      src: fallback.src,
      srcset: fallback.srcSet?.attribute,
      sizes: IMAGE_SIZES,
      alt,
      width: meta.width,
      height: meta.height,
      loading: 'lazy',
      decoding: 'async',
      className: ['content-image'],
    },
    children: [],
  };

  const picture: HastElement = {
    type: 'element',
    tagName: 'picture',
    properties: {},
    children: [sourceAvif, sourceWebp, fallbackImg],
  };

  if (title) {
    const figure: HastElement = {
      type: 'element',
      tagName: 'figure',
      properties: { className: ['content-figure'] },
      children: [
        picture,
        {
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: title }],
        },
      ],
    };
    parent.children[index] = figure as ElementContent;
  } else {
    parent.children[index] = picture as ElementContent;
  }
};

const rehypeCollectHeadings = (target: Heading[]) => () =>
  (tree: HastRoot) => {
    visit(tree, 'element', (node) => {
      const match = /^h([1-6])$/.exec(node.tagName);
      if (!match) return;
      const slug = node.properties?.id;
      if (typeof slug !== 'string') return;
      target.push({
        depth: Number(match[1]),
        text: hastToString(node),
        slug,
      });
    });
  };

const remarkAbsolutizeImages = (postId: string, siteUrl: string) => () =>
  async (tree: MdastRoot) => {
    const tasks: Promise<void>[] = [];
    visit(tree, 'image', (node: MdastImage) => {
      const src = node.url;
      if (!src.startsWith('./') && !src.startsWith('../')) return;
      const meta = resolveImage(postId, src);
      if (!meta) return;
      tasks.push(
        getImage({ src: meta }).then((result) => {
          node.url = new URL(result.src, siteUrl).href;
        }),
      );
    });
    await Promise.all(tasks);
  };

type RenderResult = {
  html: string;
  headings: Heading[];
  markdown: string;
};

const buildHtmlProcessor = (postId: string, headings: Heading[]) =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkUnknownDirectivesToText)
    .use(remarkBotForHtml)
    .use(remarkRehype)
    .use(rehypeUnwrapImageParagraphs)
    .use(rehypeContentImages(postId))
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeCollectHeadings(headings))
    .use(rehypeShiki, { theme: 'github-dark' })
    .use(rehypeStringify, { allowDangerousHtml: true });

const buildMarkdownProcessor = (postId: string, siteUrl: string) =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkUnknownDirectivesToText)
    .use(remarkBotForMarkdown)
    .use(remarkAbsolutizeImages(postId, siteUrl))
    .use(remarkStringify, { bullet: '-', fences: true });

const renderPost = async (
  post: CollectionEntry<'posts'>,
  options: { siteUrl: string },
): Promise<RenderResult> => {
  const headings: Heading[] = [];
  const body = post.body ?? '';
  const htmlFile = await buildHtmlProcessor(post.id, headings).process(body);
  const markdownFile = await buildMarkdownProcessor(post.id, options.siteUrl).process(body);
  return {
    html: String(htmlFile),
    headings,
    markdown: String(markdownFile),
  };
};

export { renderPost };
export type { Heading, RenderResult };
