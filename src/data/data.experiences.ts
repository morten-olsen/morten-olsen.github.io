import { getCollection, getEntry } from "astro:content";

class Experiences {
  public getAll = async () => {
    const collection = await getCollection('experiences');
    return collection.sort(
      (a, b) => new Date(b.data.startDate).getTime() - new Date(a.data.startDate).getTime(),
    );
  }

  public get = async (id: string) => {
    const entry = await getEntry('experiences', id);
    if (!entry) {
      throw new Error(`Experience ${id} not found`);
    }
    return entry;
  }

  public getCurrent = async () => {
    const all = await this.getAll();
    return all.find((experience) => !experience.data.endDate);
  }

  public getPrevious = async () => {
    const all = await this.getAll();
    return all.filter((experience) => experience.data.endDate);
  }
}

const experiences = new Experiences();

export { experiences }
