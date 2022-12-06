import { DocumentResult, replaceImages } from '@morten-olsen/goodwrites';
import { marked } from 'marked';
import { resolve } from 'path';
import { latexToPdf, renderer, Renderer, sanitize } from './utils';

type WrapOptions = {
  body: string;
  cover: {
    title: string;
    image?: string;
  };
};

type Parser = {
  wrap?: (options: WrapOptions) => string;
  renderer?: Renderer;
};

const defaultWrap = (options: WrapOptions) => {
  return `
\\documentclass{article}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\title{${sanitize(options.cover.title)}}
\\begin{document}
\\maketitle
${
  options.cover.image
    ? `\\includegraphics[width=\\textwidth]{${options.cover.image}}`
    : ''
}
${options.body}
\\end{document}
  `;
};

const toLatex = async (document: DocumentResult, parser?: Parser) => {
  const { content } = await replaceImages(document, {
    replaceImage: (a) => a,
  });
  const wrap = parser?.wrap || defaultWrap;
  const baseRender = renderer(0);
  const render = {
    ...baseRender,
    ...(parser?.renderer?.(0) || {}),
  };
  marked.use({ renderer: render });
  const markdown = marked.parse(content);
  const wrapped = wrap({
    body: markdown,
    cover: {
      title: document.title,
      image: document.cover ? resolve(document.cwd, document.cover) : undefined,
    },
  });

  return wrapped;
};

const toPdf = async (document: DocumentResult, parser?: Parser) => {
  const latex = await toLatex(document, parser);
  const pdf = await latexToPdf(latex);
  return pdf;
};

export type { Parser, WrapOptions };
export { toLatex, toPdf };
