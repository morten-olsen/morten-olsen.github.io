import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { data } from '~/data/data';

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
};

const GET = async (context: APIContext) => {
  const site = context.site?.toString().replace(/\/$/, '') || 'http://localhost:3000';
  const posts = await data.posts.getPublished();
  const audioPosts = posts.filter((p) => p.audioUrl);

  return rss({
    xmlns: { itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd' },
    title: `${data.profile.name} – Blog`,
    description: 'Audio versions of blog posts by ' + data.profile.name,
    site,
    items: audioPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}`,
      enclosure: {
        url: `${site}${post.audioUrl}`,
        length: post.audioSize,
        type: 'audio/mpeg',
      },
      customData: [
        `<itunes:summary>${post.data.description}</itunes:summary>`,
        `<itunes:duration>${formatDuration(post.audioDuration)}</itunes:duration>`,
        `<itunes:explicit>false</itunes:explicit>`,
      ].join('\n'),
    })),
    customData: [
      `<language>en</language>`,
      `<itunes:author>${data.profile.name}</itunes:author>`,
      `<itunes:summary>Audio versions of blog posts by ${data.profile.name}</itunes:summary>`,
      `<itunes:explicit>false</itunes:explicit>`,
      `<itunes:image href="${site}${data.profile.image.src}" />`,
      `<itunes:owner>`,
      `  <itunes:name>${data.profile.name}</itunes:name>`,
      data.profile.contact?.email ? `  <itunes:email>${data.profile.contact.email}</itunes:email>` : '',
      `</itunes:owner>`,
      `<itunes:category text="Technology" />`,
    ].filter(Boolean).join('\n'),
  });
};

export { GET };
