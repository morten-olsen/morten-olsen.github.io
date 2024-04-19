import { getCollection } from 'astro:content'

class Work {
  public find = () => getCollection('work')
  public get = async (slug: string) => {
    const collection = await this.find()
    return collection.find((entry) => entry.slug === slug)
  }
}

type WorkItem = Exclude<Awaited<ReturnType<Work['get']>>, undefined>
export { Work, type WorkItem }
