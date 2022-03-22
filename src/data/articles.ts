import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import behead from 'remark-behead';
import { visit } from 'unist-util-visit';

const imageModules = (require as any).context(
  '../../articles',
  true,
  /\.(png|jpeg)$/,
)
const images = imageModules.keys().map((key) => ({
  key,
  url: imageModules(key).default,
}));

const replaceImages = ({ id }) => (tree: any) => {
  visit(tree, 'image', (node) => {
    console.log(id);
    if (!node.url.startsWith('./')) return;
    const correctedUrl = `.${path.resolve('/', id, node.url)}`;
    const image = images.find((i: any) => i.key === correctedUrl);
    node.url = image.url;
  })
}

export type ArticlePart = string | {
  title?: string;
  file?: string;
  notes?: string;
  parts?: ArticlePart[];
}

export type Article = {
  id: string;
  title: string;
  parts: ArticlePart[];
  cover?: string;
  summery?: string;
  published?: string;
  content: string;
  html: string;
}

export class Articles {
  #articles: Promise<Article[]>;
  #images: typeof images;

  constructor() {
    this.#images = images;
    this.#articles = this.#load();
  }

  #loadArticle = async (location: string) => {
    const id = path.basename(location);
    const structureLocation = path.join(location, 'index.yml');
    const structureContent = await fs.readFile(structureLocation, 'utf-8');
    const structure = yaml.parse(structureContent) as Article; 

    const buildParts = async (part: ArticlePart, depth: number) => {
      const content = []; 
      if (typeof part === 'string') {
        part = {
          file: part,
        }
      }
      if (part.title) {
        content.push(
          ''.padStart(depth + 1, '#') + ' ' + part.title,
        );
      }
      if (part.file) {
        const fileLocation = path.join(location, part.file);
        const fileContent = await fs.readFile(fileLocation, 'utf-8');
        content.push(
          await remark().use(behead, { depth }).use(replaceImages, { id }).process(fileContent),
        );
      }
      if (part.parts) {
        content.push(
          ...await Promise.all(
            part.parts.map((part) => buildParts(part, depth + 1)),
          ),
        );
      }
      return content.join('\n');
    };

    const articleContent = await Promise.all(
      structure.parts.map((part) => buildParts(part, 1)),
    );
    const cover = structure.cover
      ? this.getImage(id, structure.cover)
      : null;


    const article: Article = {
      ...structure,
      id,
      cover,
      content: articleContent.join('\n'),
      html: String(await remark().use(remarkHtml).process(articleContent.join('\n'))),
    };

    return article;
  };

  #load = async () => {
    const rootLocation = path.join(process.cwd(), 'articles');
    const articleLocations = await fs.readdir(rootLocation);
    const articles = await Promise.all(articleLocations.map(
      (location) => this.#loadArticle(path.join(rootLocation, location)),
    ));
    return articles;
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
    const articles = await this.#articles;
    return articles;
  }
}

export const articleDB = new Articles();
