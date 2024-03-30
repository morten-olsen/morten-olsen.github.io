import { getCollection } from 'astro:content';

class Skills {
  public find = () => getCollection('skills');
  public get = async (slug: string) => {
    const collection = await this.find();
    return collection.find((entry) => entry.slug === slug);
  };
}

type Skill = Exclude<Awaited<ReturnType<Skills['get']>>, undefined>;

export { Skills, type Skill };
