import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { profile } from "./data.profile";

class Posts {
  #map = (post: CollectionEntry<'posts'>) => {
    const readingTime = Math.ceil((post.body?.split(/\s+/g).length ?? 0) / 200) || 1;
    return Object.assign(post, {
      readingTime,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.data.title,
        description: post.data.description,
        image: `/posts/${post.id}/share.png`,
        datePublished: post.data.pubDate.toISOString(),
        dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
        keywords: post.data.tags?.join(', '),
        inLanguage: 'en-US',
        author: {
          '@type': 'Person',
          name: profile.name,
          url: profile.url,
        },
        publisher: {
          '@type': 'Person',
          name: profile.name,
          url: profile.url,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `/posts/${post.id}`,
        },
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
