import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import behead from 'remark-behead';
import { visit } from 'unist-util-visit';

const imageModules = (require as any).context(
  '../../experiences',
  true,
  /\.(png|jpeg)$/,
)
const images = imageModules.keys().map((key) => ({
  key,
  url: imageModules(key).default,
}));

const replaceImages = ({ id }) => (tree: any) => {
  visit(tree, 'image', (node) => {
    if (!node.url.startsWith('./')) return;
    const correctedUrl = `.${path.resolve('/', id, node.url)}`;
    const image = images.find((i: any) => i.key === correctedUrl);
    node.url = image.url;
  })
}

export type Experience = {
  id: string;
  company: {
    name: string;
  }
  title: string;
  startDate: string;
  endDate: string;
  content: string;
  html: string;
}

export class ExperienceDB {
  #experiences: Promise<Experience[]>;
  #images: typeof images;

  constructor() {
    this.#images = images;
    this.#experiences = this.#load();
  }

  #loadExperience = async (location: string) => {
    const id = path.basename(location);
    const structureLocation = path.join(location, 'index.yml');
    const structureContent = await fs.readFile(structureLocation, 'utf-8');
    const structure = yaml.parse(structureContent) as Experience; 

    const fileLocation = path.join(location, 'description.md');
    const fileContent = await fs.readFile(fileLocation, 'utf-8');
    const content = await remark().use(replaceImages, { id }).process(fileContent);

    const experience: Experience = {
      ...structure,
      id,
      content: String(content),
      html: String(await remark().use(remarkHtml).process(content)),
    };

    return experience;
  };

  #load = async () => {
    const rootLocation = path.join(process.cwd(), 'experiences');
    const articleLocations = await fs.readdir(rootLocation);
    const articles = await Promise.all(articleLocations.map(
      (location) => this.#loadExperience(path.join(rootLocation, location)),
    ));
    return articles.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  public getImage = (article: string, name: string) => {
    const url = `.${path.resolve('/', article, name)}`;
    const image = this.#images.find((i: any) => i.key === url);
    return image ? image.url : null;
  }

  public get = async (id: string) => {
    const articles = await this.list();
    const article = articles.find(a => a.id === id);
    return article;
  };

  public list = async () => {
    const experiences = await this.#experiences;
    return experiences;
  }
}

export const experienceDB = new ExperienceDB();
