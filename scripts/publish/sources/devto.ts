interface DevtoArticle {
  title: string;
  body: string;
  description: string;
  tags: string[];
  canonicalUrl: string;
  coverImageUrl?: string;
}

// dev.to tags must be lowercase, alphanumeric, max 4 per article
const normalizeTags = (tags: string[]): string[] =>
  tags
    .map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)
    .slice(0, 4);

const publishToDevto = async (article: DevtoArticle): Promise<number> => {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) throw new Error('DEVTO_API_KEY not set');

  const body = {
    article: {
      title: article.title,
      body_markdown: article.body,
      description: article.description,
      tags: normalizeTags(article.tags),
      canonical_url: article.canonicalUrl,
      published: true,
      ...(article.coverImageUrl ? { main_image: article.coverImageUrl } : {}),
    },
  };

  const response = await fetch('https://dev.to/api/articles', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`dev.to API error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as { id: number };
  return data.id;
};

export { publishToDevto };
