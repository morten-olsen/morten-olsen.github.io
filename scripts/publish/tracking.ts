import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const TRACKING_FILE = join(process.cwd(), '.github', 'published.json');

interface TrackingEntry {
  // number = ID from our script; string = pre-existing URL (manually seeded)
  devto?: number | string;
  hashnode?: string;
}

type Tracking = Record<string, TrackingEntry>;

const readTracking = async (): Promise<Tracking> => {
  if (!existsSync(TRACKING_FILE)) return {};
  const raw = await readFile(TRACKING_FILE, 'utf-8');
  return JSON.parse(raw) as Tracking;
};

const writeTracking = async (tracking: Tracking): Promise<void> => {
  await writeFile(TRACKING_FILE, JSON.stringify(tracking, null, 2) + '\n', 'utf-8');
};

export type { Tracking, TrackingEntry };
export { readTracking, writeTracking };
