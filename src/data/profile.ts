
import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';

const imageModules = (require as any).context(
  '../../profile',
  true,
  /\.(png|jpe?g|svg)$/,
)
const images = imageModules.keys().map((key) => ({
  key,
  url: imageModules(key).default,
}));

export type Profile = {
  name: string;
  avatar?: string | null;
  email?: string;
  location?: string;
  tagline?: string;
  social: {
    name: string;
    value: string;
    link: string;
    logo: string;
  }[]
}

export class ProfileDB {
  #profile: Promise<Profile>;

  constructor() {
    this.#profile = this.#load();
  }

  #load = async () => {
    const rootLocation = path.join(process.cwd(), 'profile');
    const structureLocation = path.join(rootLocation, 'index.yml');
    const structureContent = await fs.readFile(structureLocation, 'utf-8');
    const structure = yaml.parse(structureContent) as Profile; 
    if (structure.avatar) {
      const image = images.find((i: any) => i.key === `.${path.resolve('/', structure.avatar)}`)
      structure.avatar = image.url;
    }
    structure.social = structure.social.map((social) => {
      const image = images.find((i: any) => i.key === `.${path.resolve('/', social.logo)}`)
      return {
        ...social,
        logo: image?.url || null,
      };
    })
    return structure;
  }

  public get = async () => {
    const profile = await this.#profile;
    return profile;
  };
}

export const profileDB = new ProfileDB();
