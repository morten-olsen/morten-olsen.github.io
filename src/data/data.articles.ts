import { getCollection } from 'astro:content'

class Articles {
  public find = () => getCollection('articles')
  public get = async (slug: string) => {
    const collection = await this.find()
    return collection.find((entry) => entry.slug === slug)
  }
}

type Article = Exclude<Awaited<ReturnType<Articles['get']>>, undefined>

export { Articles, type Article }
