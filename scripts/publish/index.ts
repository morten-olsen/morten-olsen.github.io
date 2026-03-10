/**
 * Article publisher — publishes one pending article per run to configured platforms.
 *
 * An article is eligible when:
 *   - its publishOn date <= today
 *   - it hasn't been fully published to all configured platforms yet
 *
 * Per run: picks the oldest eligible article, tries each configured platform,
 * and updates the tracking file. Failed platforms are retried on the next run.
 */

import { readTracking, writeTracking, type TrackingEntry } from './tracking.ts';
import { getPosts } from './content.ts';
import { publishToDevto } from './sources/devto.ts';
import { publishToHashnode } from './sources/hashnode.ts';

const SITE_URL = (process.env.SITE_URL ?? 'https://mortenolsen.pro').replace(/\/$/, '');

const isDevtoConfigured = () => Boolean(process.env.DEVTO_API_KEY);
const isHashnodeConfigured = () =>
  Boolean(process.env.HASHNODE_API_KEY && process.env.HASHNODE_PUBLICATION_ID);

const isFullyPublished = (entry: TrackingEntry): boolean => {
  if (isDevtoConfigured() && !entry.devto) return false;
  if (isHashnodeConfigured() && !entry.hashnode) return false;
  return true;
};

const main = async () => {
  if (!isDevtoConfigured() && !isHashnodeConfigured()) {
    console.log('No platforms configured. Set DEVTO_API_KEY or HASHNODE_API_KEY + HASHNODE_PUBLICATION_ID.');
    return;
  }

  const tracking = await readTracking();
  const posts = await getPosts();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter: publishOn date reached AND not yet fully published
  const eligible = posts
    .filter((p) => p.publishOn <= today)
    .filter((p) => !isFullyPublished(tracking[p.dirName] ?? {}))
    .sort((a, b) => a.publishOn.getTime() - b.publishOn.getTime()); // oldest first

  if (eligible.length === 0) {
    console.log('Nothing to publish. All eligible articles are already up to date.');
    return;
  }

  const post = eligible[0];
  const canonicalUrl = `${SITE_URL}/posts/${post.astroId}`;
  const coverImageUrl = `${SITE_URL}/posts/${post.astroId}/share.png`;

  console.log(`Publishing: "${post.title}" (${post.dirName})`);
  console.log(`  Canonical URL: ${canonicalUrl}`);
  console.log(`  Platforms: ${[isDevtoConfigured() && 'dev.to', isHashnodeConfigured() && 'Hashnode'].filter(Boolean).join(', ')}`);

  const entry: TrackingEntry = tracking[post.dirName] ?? {};
  let changed = false;

  if (isDevtoConfigured() && !entry.devto) {
    try {
      const id = await publishToDevto({
        title: post.title,
        body: post.body,
        description: post.description,
        tags: post.tags,
        canonicalUrl,
        coverImageUrl,
      });
      entry.devto = id;
      changed = true;
      console.log(`  ✓ dev.to published (id: ${id})`);
    } catch (err) {
      console.error(`  ✗ dev.to failed (will retry next run):`, (err as Error).message);
    }
  }

  if (isHashnodeConfigured() && !entry.hashnode) {
    try {
      const id = await publishToHashnode({
        title: post.title,
        body: post.body,
        description: post.description,
        tags: post.tags,
        canonicalUrl,
        coverImageUrl,
      });
      entry.hashnode = id;
      changed = true;
      console.log(`  ✓ Hashnode published (id: ${id})`);
    } catch (err) {
      console.error(`  ✗ Hashnode failed (will retry next run):`, (err as Error).message);
    }
  }

  if (changed) {
    tracking[post.dirName] = entry;
    await writeTracking(tracking);
    console.log('Tracking file updated.');
  }

  // Report any remaining articles in the queue
  const remaining = eligible.length - 1;
  if (remaining > 0) {
    console.log(`${remaining} more article(s) queued for future runs.`);
  }
};

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
