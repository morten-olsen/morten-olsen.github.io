import path from 'path';
import { LatexGenerator } from "../Generator";
import Container from 'typedi';
import { AssetResolver } from '../../../../data/assets';
import { ProfileDB } from '../../../../data/repos/profile';
import { ExperienceDB } from '../../../../data/repos/experiences';
import { fromMarkdown } from '../../helpers/convert';

const assets = {
  getPath: (...source: string[]) => {
    return path.join(process.cwd(), 'content', ...source);
  },
}
type Data = {
  structure: string;
}
const resume: LatexGenerator<Data> = async (data, location) => {
  Container.set(AssetResolver, assets);
  const profileDB = Container.get(ProfileDB);
  const experienceDB = Container.get(ExperienceDB);

  const profile = await profileDB.get();
  const avatar = profile.resumeImage;
  const experiences = await experienceDB.list();

  return `
\\documentclass[10pt, a4paper]{article}
\\usepackage[top=2cm, bottom=2cm, left=2cm, right=2cm]{geometry}
\\def \\columncount {3}
\\def \\skillcolumncount {2}
\\usepackage{pagecolor}
\\usepackage{paracol}
\\usepackage{kantlipsum}
\\usepackage{multicol}
\\usepackage{xifthen}
\\usepackage{tcolorbox}
\\usepackage{wrapfig}
\\usepackage{graphicx}
\\usepackage{fancyhdr}

\\setlength{\\columnseprule}{0.1pt}
\\pagestyle{fancy}
\\fancyhf{}
\\rhead{Morten Olsen \\today}
\\lhead{Curriculum Vitae}
\\rfoot{Page \\thepage}

\\begin{document}
  \\noindent
  \\begin{minipage}{\\textwidth}
    \\noindent
    \\begin{minipage}{\\textwidth - 3.2cm}
      \\Huge Curriculum Vitae
      \\newline\\large ${profile.name}
    \\end{minipage}
    \\noindent
    \\begin{minipage}{3cm}
      \\begin{flushright}
        \\includegraphics[height=3cm]{${avatar}}
      \\end{flushright}
    \\end{minipage}
    \\vspace{0.5cm}
    \\hrule
    \\vspace{0.5cm}
    \\begin{multicols}{2}
      \\noindent \\textbf{E-mail}\\dotfill ${profile.email}\\\\
      \\noindent \\textbf{Location}\\dotfill ${profile.location}\\\\
      \\noindent \\textbf{Github}\\dotfill ${profile.github}\\\\
    \\end{multicols}
  \\end{minipage}
  \\hfill
  \\begin{minipage}{\\textwidth/3-2cm}
  \\end{minipage}
  \\vspace{1cm}
  \\hrule


  \\section*{Platforms and Languages}
  Platforms and languages which I have worked with. The list is a shortened down version.\\\\\\\\
  \\noindent
  \\begin{minipage}{\\textwidth}
    \\begin{multicols}{2}
      ${profile.platforms.map(({ name, level }) => `
        \\textbf{${name}} \\textit{${level}}
      `).join('\n')}
    \\end{multicols}
  \\end{minipage}
  \\vspace{0.5cm}
  \\hrule

  \\section*{Experiences}
  ${experiences.map((experience) => `
    \\noindent
    \\begin{multicols}{3}
      \\noindent{\\Large \\textbf{${experience.company.name}}} \\hfill {\\small ${experience.startDate} - ${experience.endDate}} \\\\
      \\textit{${experience.title}}
      \\vfill\\null\\columnbreak
      ${fromMarkdown(experience.content, 0)}
    \\end{multicols}
    \\vspace{0.5cm}
    \\hrule
  `).join('\n')}


  \\section*{Frameworks}
  This list of frameworks is a curated list of frameworks I have been using recently and therefore are all amongst frameworks which I prefer to work with.\\\\\\\\
  \\noindent
  \\begin{minipage}{\\textwidth}
    \\begin{multicols}{2}
      ${profile.skills.map(({ name, level }) => `
        \\textbf{${name}} \\textit{${level}}
      `).join('\n')}
    \\end{multicols}
  \\end{minipage}
  \\vspace{0.5cm}
  \\hrule
\\end{document}
  `;
}

export { resume };
