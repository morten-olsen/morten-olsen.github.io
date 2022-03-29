import type { Article } from "../../../data/repos/articles";
import fs from 'fs-extra';
import { LatexGenerator } from "../Generator";
import { generate } from '../../../data/helpers/markdown';
import path from 'path';
import yaml from 'yaml';
import { fromMarkdown } from "../../helpers/convert";

const assets = {
  getPath: (source: string) => {
    return source;
  },
}
type Data = {
  structure: string;
}
const article: LatexGenerator<Data> = async (data, location) => {
  const dir = path.dirname(location);
  const structureLocation = path.resolve(dir, data.structure);
  const structureContent = await fs.readFile(structureLocation, 'utf-8');
  const structure = yaml.parse(structureContent) as Article;
  const sections = await Promise.all(structure.parts.map(
    part => generate(
      dir,
      part,
      1,
      assets,
    ),
  ));
  const content = sections.join('\n\n');

  return `
\\documentclass[twocolumn]{article}
\\usepackage{graphicx}
\\usepackage[skip=5pt plus1pt, indent=10pt]{parskip}
\\setlength\\columnsep{1cm}
\\title{${structure.title}}
\\begin{document}
\\maketitle
${fromMarkdown(content, 0)}
\\end{document}
  `;
}

export { article };
