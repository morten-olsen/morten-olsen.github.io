import { getCollection, getEntry } from "astro:content";

class Projects {
  public getAll = async () => {
    const collection = await getCollection('projects');
    return collection;
  }

  public get = async (id: string) => {
    const entry = await getEntry('projects', id);
    if (!entry) {
      throw new Error(`Could not find project ${id}`);
    }
    return entry;
  }
}

const projects = new Projects();

export { projects }
