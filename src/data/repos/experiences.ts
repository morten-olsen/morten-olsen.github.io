import fs from 'fs-extra';
import path from 'path';
import { Service } from 'typedi';
import yaml from 'yaml';
import { AssetResolver } from '../assets';
import { generate } from '../helpers/markdown';

export type Experience = {
  id: string;
  company: {
    name: string;
  }
  title: string;
  content: string;
  startDate: string;
  endDate: string;
}

@Service()
export class ExperienceDB {
  #experiences: Promise<Experience[]>;
  #assets: AssetResolver;

  constructor(
    assets: AssetResolver,
  ) {
    this.#assets = assets;
    this.#experiences = this.#load();
  }

  #loadExperience = async (location: string) => {
    const id = path.basename(location);
    const structureLocation = path.join(location, 'index.yml');
    const structureContent = await fs.readFile(structureLocation, 'utf-8');
    const structure = yaml.parse(structureContent) as Experience; 

    const content = await generate(
      location,
      'description.md',
      1,
      this.#assets,
    )

    const experience: Experience = {
      ...structure,
      id,
      content: String(content),
    };

    return experience;
  };

  #load = async () => {
    const rootLocation = path.join(process.cwd(), 'content', 'experiences');
    const articleLocations = await fs.readdir(rootLocation);
    const articles = await Promise.all(articleLocations.map(
      (location) => this.#loadExperience(path.join(rootLocation, location)),
    ));
    return articles.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
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
