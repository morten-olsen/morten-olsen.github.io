import { getCollection, getEntry } from "astro:content";

class Skills {
  public getAll = async () => {
    const collection = await getCollection('skills');
    return collection;
  }

  public get = async (id: string) => {
    const entry = await getEntry('skills', id);
    if (!entry) {
      throw new Error(`Could not find skill ${id}`);
    }
    return entry;
  }
}

const skills = new Skills();

export { skills }
