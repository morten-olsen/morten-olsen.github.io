import { LatexGenerator } from "../Generator";
import Container from 'typedi';
import { AssetResolver } from '../../../data/assets';
import { ProfileDB } from '../../../data/repos/profile';
import { ExperienceDB } from '../../../data/repos/experiences';

const assets = {
  getPath: (source: string) => {
    return source;
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
  const experiences = await experienceDB.list();

  return `
\\documentclass[twocolumn]{article}
\\usepackage{graphicx}
\\usepackage[skip=5pt plus1pt, indent=10pt]{parskip}
\\setlength\\columnsep{1cm}
\\title{${profile.name}}
\\begin{document}
\\maketitle
\\end{document}
  `;
}

export { resume };
