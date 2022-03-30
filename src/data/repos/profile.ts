
import fs from 'fs-extra';
import path from 'path';
import { Service } from 'typedi';
import yaml from 'yaml';
import { AssetResolver } from '../assets';

export type Profile = {
  name: string;
  avatar?: string | null;
  email?: string;
  github?: string;
  location?: string;
  tagline?: string;
  resume: string;
  social: {
    name: string;
    value: string;
    link: string;
    logo: string;
  }[];
  resumeImage?: string;
  platforms: {
    name: string;
    level: number;
  }[];
  skills: {
    name: string;
    level: number;
  }[];
}

@Service()
export class ProfileDB {
  #profile: Promise<Profile>;
  #assets: AssetResolver;

  constructor(
    assets: AssetResolver,
  ) {
    this.#assets = assets;
    this.#profile = this.#load();
  }

  #load = async () => {
    const rootLocation = path.join(process.cwd(), 'content', 'profile');
    const structureLocation = path.join(rootLocation, 'index.yml');
    const structureContent = await fs.readFile(structureLocation, 'utf-8');
    const structure = yaml.parse(structureContent) as Profile; 
    if (structure.avatar) {
      const image = this.#assets.getPath(
        'profile',
        structure.avatar,
      )?.url
      structure.avatar = image || null;
    }
    if (structure.resumeImage) {
      const image = this.#assets.getPath(
        'profile',
        structure.resumeImage,
      )
      structure.resumeImage = image || null;
    }
    structure.social = structure.social.map((social) => {
      const image = this.#assets.getPath('profile', social.logo);
      return {
        ...social,
        logo: image || null,
      };
    })
    structure.resume = this.#assets.getPath(
      'profile',
      'a4.gen.yml',
    )?.url || null;
    return structure;
  }

  public get = async () => {
    const profile = await this.#profile;
    return profile;
  };
}
