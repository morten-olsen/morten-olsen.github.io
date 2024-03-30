import { getCollection } from 'astro:content';

class References {
  public find = () => getCollection('references');
  public get = async (slug: string) => {
    const collection = await this.find();
    return collection.find((entry) => entry.slug === slug);
  };
}

type Reference = Exclude<Awaited<ReturnType<References['get']>>, undefined>;

export { References, type Reference };
