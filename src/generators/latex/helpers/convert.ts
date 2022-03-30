import { existsSync } from 'fs-extra';
import { decode } from 'html-entities';
import { marked } from 'marked';

const latexTypes = [
  '',
  'section',
  'subsection',
  'paragraph',
];

const sanitize = (text?: string) => {
  if (!text) return '';
  return decode(text)
    .replace('&', '\\&')
    .replace('_', '\\_')
    .replace(/([^\\])\}/g, '$1\\}')
    .replace(/([^\\])\{/g, '$1\\{')
    .replace(/[^\\]\[/g, '\\[')
    .replace('#', '\\#');
};

const renderer = (outerDepth: number) =>  ({
  heading: (text: string, depth: number) => {
    return `\\${latexTypes[outerDepth + depth]}{${sanitize(text)}}\n\n`
  },
  code: (input: string) => {
    return `
    \\begin{lstlisting}
    ${input}
    \\end{lstlisting}
    `
  },
  text: (input: string) => {
    return sanitize(input);
  },
  paragraph: (input: string) => {
    return `${input}\n\n`
  },
  list: (input: string) => {
    return `
    \\begin{itemize}
    ${input}
    \\end{itemize}
    `
  },
  listitem: (input: string) => {
    return `\\item{${input}}`
  },
  link: (href: string, text: string) => {
    if (!text || text === href) {
      return `\\url{${sanitize(href)}}`;
    }
    return `${sanitize(text)} (\\url{${sanitize(href)}})`
  },
  strong: (text: string) => {
    return `\\textbf{${sanitize(text)}}`
  },
  em: (text: string) => {
    return `\\textbf{${sanitize(text)}}`
  },
  codespan: (code: string) => {
    return `\\texttt{${sanitize(code)}}`
  },
  image: (link: string) => {
    if (!existsSync(link)) {
      return 'Online image not supported';
    }
    return `\\begin{figure}[h!]
  \\includegraphics[width=0.5\\textwidth]{${link}}
  \\centering
\\end{figure}
`
  },
});


export const fromMarkdown = (md: string, depth: number) => {
  marked.use({ renderer: renderer(depth) });
  return marked.parse(md);
}
