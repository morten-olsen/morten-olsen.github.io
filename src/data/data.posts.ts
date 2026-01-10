import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { profile } from "./data.profile";

class Posts {
  #map = (post: CollectionEntry<'posts'>) => {
    const readingTime = Math.ceil(post.body?.split(/\s+/g).length / 200) || 1;
    return Object.assign(post, {
      readingTime,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.data.title,
        image: post.data.heroImage.src,
        datePublished: post.data.pubDate.toISOString(),
        keywords: post.data.tags,
        inLanguage: 'en-US',
        author: {
          '@type': 'Person',
          name: profile.name,
        }
      },
    });
  }

  public getPublished = async () => {
    const collection = await getCollection('posts');
    return collection
      .map(this.#map)
      .sort(
        (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
      )
  }

  public get = async (id: string) => {
    const entry = await getEntry('posts', id);
    if (!entry) {
      throw new Error(`Entry ${id} not found`)
    }
    return this.#map(entry);
  }
}

const posts = new Posts();

export { posts }
