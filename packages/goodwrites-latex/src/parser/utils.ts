import { decode } from 'html-entities';
import latex from 'node-latex';
import { Readable } from 'stream';
import { existsSync } from 'fs';

const sanitize = (text?: string) => {
  if (!text) {
    return '';
  }
  return decode(text)
    .replace('&', '\\&')
    .replace('_', '\\_')
    .replace(/([^\\])\}/g, '$1\\}')
    .replace(/([^\\])\{/g, '$1\\{')
    .replace(/[^\\]\[/g, '\\[')
    .replace(/#/g, '\\#');
};

const sanitizeUrl = (text?: string) => {
  if (!text) {
    return '';
  }
  return decode(text)
    .replace(/\//g, '\\/');
};

const latexTypes = ['', '', 'section', 'subsection', 'paragraph', 'subparagraph'];

type Renderer = (depth: number) => {
  heading?: (text: string, depth: number) => string;
  code?: (input: string) => string;
  text?: (input: string) => string;
  paragraph?: (input: string) => string;
  list?: (input: string) => string;
  listitem?: (input: string) => string;
  link?: (href: string, text: string) => string;
  strong?: (text: string) => string;
  em?: (text: string) => string;
  codespan?: (code: string) => string;
  image?: (link: string) => string;
};

const renderer = (outerDepth: number) => ({
  heading: (text: string, depth: number) => {
    return `\\${latexTypes[outerDepth + depth]}{${sanitize(text)}}\n\n`;
  },
  code: (input: string) => {
    return `
    \\begin{lstlisting}
    ${input}
    \\end{lstlisting}
    `;
  },
  text: (input: string) => {
    return sanitize(input);
  },
  paragraph: (input: string) => {
    return `${input}\n\n`;
  },
  list: (input: string) => {
    return `
    \\begin{itemize}
    ${input}
    \\end{itemize}
    `;
  },
  listitem: (input: string) => {
    return `\\item{${input}}`;
  },
  link: (href: string, text: string) => {
    if (!text || text === href) {
      return `\\url{${sanitize(href)}}`;
    }
    return `${sanitize(text)} (\\url{${sanitize(href)}})`;
  },
  strong: (text: string) => {
    return `\\textbf{${sanitize(text)}}`;
  },
  em: (text: string) => {
    return `\\textbf{${sanitize(text)}}`;
  },
  codespan: (code: string) => {
    return `\\texttt{${sanitize(code)}}`;
  },
  image: (link: string) => {
    if (!existsSync(link)) {
      return 'Online image not supported';
    }
    return `\\begin{figure}[h!]
  \\includegraphics[width=0.5\\textwidth]{${link}}
  \\centering
\\end{figure}
`;
  },
});

const latexToPdf = (doc: string) =>
  new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const input = new Readable();
    input.push(doc);
    input.push(null);
    const latexStream = latex(input);
    latexStream.on('data', (chunk) => {
      chunks.push(Buffer.from(chunk));
    });
    latexStream.on('finish', () => {
      const result = Buffer.concat(chunks);
      resolve(result);
    });
    latexStream.on('error', (err) => {
      reject(err);
    });
  });

export type { Renderer };
export { sanitize, renderer, latexToPdf };
