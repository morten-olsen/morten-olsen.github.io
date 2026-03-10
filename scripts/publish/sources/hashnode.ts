interface HashnodeArticle {
  title: string;
  body: string;
  description: string;
  tags: string[];
  canonicalUrl: string;
  coverImageUrl?: string;
}

const HASHNODE_API = 'https://gql.hashnode.com/';

const PUBLISH_MUTATION = `
  mutation PublishPost($input: PublishPostInput!) {
    publishPost(input: $input) {
      post {
        id
        url
      }
    }
  }
`;

const publishToHashnode = async (article: HashnodeArticle): Promise<string> => {
  const apiKey = process.env.HASHNODE_API_KEY;
  const publicationId = process.env.HASHNODE_PUBLICATION_ID;
  if (!apiKey) throw new Error('HASHNODE_API_KEY not set');
  if (!publicationId) throw new Error('HASHNODE_PUBLICATION_ID not set');

  const input: Record<string, unknown> = {
    title: article.title,
    contentMarkdown: article.body,
    publicationId,
    originalArticleURL: article.canonicalUrl,
    metaTags: {
      title: article.title,
      description: article.description,
    },
  };

  if (article.tags.length > 0) {
    // Hashnode tags are slugs; use lowercased tag names as slugs
    input.tags = article.tags.map((t) => ({ slug: t.toLowerCase().replace(/\s+/g, '-'), name: t }));
  }

  if (article.coverImageUrl) {
    input.coverImageOptions = { coverImageURL: article.coverImageUrl };
  }

  const response = await fetch(HASHNODE_API, {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: PUBLISH_MUTATION, variables: { input } }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Hashnode API error ${response.status}: ${text}`);
  }

  const data = (await response.json()) as {
    data?: { publishPost?: { post?: { id: string } } };
    errors?: { message: string }[];
  };

  if (data.errors?.length) {
    throw new Error(`Hashnode GraphQL error: ${data.errors.map((e) => e.message).join(', ')}`);
  }

  const id = data.data?.publishPost?.post?.id;
  if (!id) throw new Error('Hashnode returned no post id');
  return id;
};

export { publishToHashnode };
