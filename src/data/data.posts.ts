import { getCollection, getEntry, type CollectionEntry } from "astro:content";
import { statSync } from "node:fs";
import { execSync } from "node:child_process";
import { profile } from "./data.profile";

const audios = import.meta.glob('/src/content/posts/**/assets/*.mp3', { eager: true, query: '?url', import: 'default' });

const getAudioMeta = (globKey: string): { size: number; duration: number } => {
  try {
    const filePath = globKey.replace(/^\//, '');
    const size = statSync(filePath).size;
    const raw = execSync(
      `ffprobe -v error -show_entries format=duration -of csv=p=0 "${filePath}"`,
    ).toString().trim();
    const duration = Math.round(parseFloat(raw));
    return { size, duration };
  } catch {
    return { size: 0, duration: 0 };
  }
};

class Posts {
  #map = (post: CollectionEntry<'posts'>) => {
    const readingTime = Math.ceil((post.body?.split(/\s+/g).length ?? 0) / 200) || 1;
    
    let audioUrl: string | undefined = undefined;
    let audioDuration = 0;
    let audioSize = 0;
    if (post.data.audio) {
      const audioPath = `/src/content/posts/${post.id}/${post.data.audio.replace('./', '')}`;
      audioUrl = audios[audioPath] as string | undefined;
      if (audioUrl) {
        const meta = getAudioMeta(audioPath);
        audioDuration = meta.duration;
        audioSize = meta.size;
      }
    }

    return Object.assign(post, {
      readingTime,
      audioUrl,
      audioDuration,
      audioSize,
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
