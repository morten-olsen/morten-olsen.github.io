# External Publishing Setup

Articles are automatically published to external platforms via a GitHub Actions workflow that runs daily. Each run publishes **at most one article**, controlled by `publishOn` dates in each post's frontmatter.

## How It Works

1. The workflow runs daily at 08:00 UTC.
2. It reads all posts and finds those where `publishOn` ≤ today and not yet fully published.
3. It picks the oldest eligible article and publishes it to all configured platforms.
4. Results are tracked in `.github/published.json` (auto-committed by the workflow).
5. If a platform fails, it is skipped and retried on the next run — other platforms are unaffected.

A platform is only active if its secrets are set. You can enable platforms independently.

---

## Platforms

### dev.to

1. Log in to [dev.to](https://dev.to) and go to **Settings → Extensions → DEV Community API Keys**.
2. Generate a new API key.
3. Add it as a GitHub secret named **`DEVTO_API_KEY`**.

Articles are published with `canonical_url` pointing back to your site, so all SEO credit stays with you.

### Hashnode

1. Log in to [hashnode.com](https://hashnode.com) and create a blog if you haven't already.
2. Go to **Account Settings → Developer → Personal Access Tokens** and generate a token.
3. Add it as a GitHub secret named **`HASHNODE_API_KEY`**.
4. Find your Publication ID:
   - Go to your blog's dashboard.
   - The URL will be `https://hashnode.com/{publication-id}/dashboard`, or use the Hashnode GraphQL API:
     ```graphql
     query {
       me {
         publications(first: 10) {
           edges {
             node { id title }
           }
         }
       }
     }
     ```
     Run at [api.hashnode.com](https://api.hashnode.com) with your token in the `Authorization` header.
5. Add it as a GitHub secret named **`HASHNODE_PUBLICATION_ID`**.

Articles are published with `originalArticleURL` set to your canonical URL.

### Daily.dev

Daily.dev is a feed aggregator — no per-article API is needed. Submit your RSS feed once and it auto-discovers new posts.

1. Go to [daily.dev/squads](https://app.daily.dev/squads) or the [Sources submission page](https://daily.dev/sources).
2. Submit your RSS feed URL: `https://mortenolsen.pro/posts/rss.xml`
3. Done — new articles appear automatically when the feed updates.

---

## Adding GitHub Secrets

Go to your repository on GitHub → **Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Required for |
|---|---|
| `DEVTO_API_KEY` | dev.to |
| `HASHNODE_API_KEY` | Hashnode |
| `HASHNODE_PUBLICATION_ID` | Hashnode |

Secrets that are not set cause that platform to be skipped silently — no errors.

---

## Controlling Publish Timing

Each post can have an optional `publishOn` field in its frontmatter:

```yaml
---
title: My Article
pubDate: 2026-01-09
publishOn: 2026-03-10   # earliest date this article is sent to external platforms
---
```

- If `publishOn` is not set, the article is eligible immediately (defaults to `pubDate`).
- Articles are published in `publishOn` order (oldest first), one per workflow run.
- To delay or pause an article, set `publishOn` to a future date and push the change.

The existing back catalogue has `publishOn` dates staggered weekly through mid-2026.

---

## Manual Trigger

You can trigger a run manually from **Actions → Publish articles to external platforms → Run workflow**. There is also a **Dry run** checkbox that logs what would be published without actually posting anything or touching the tracking file.

---

## Tracking File

`.github/published.json` records which posts have been sent where:

```json
{
  "simple-service-pattern": {
    "devto": 1234567,
    "hashnode": "abc123def456"
  }
}
```

The workflow auto-commits changes to this file with `[skip ci]` to avoid triggering a full site rebuild.

---

## Adding a New Article

Just write your post as normal. To control when it gets externally published:

- **Publish immediately when eligible**: don't set `publishOn` (defaults to `pubDate`).
- **Schedule for a specific date**: add `publishOn: YYYY-MM-DD` to the frontmatter.
- **Keep it local-only indefinitely**: set `publishOn` to a far-future date.
