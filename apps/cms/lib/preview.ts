import type { NextApiResponse } from 'next';

const listeners = new Map<string, Set<NextApiResponse>>();

export function subscribe(slug: string, res: NextApiResponse) {
  const set = listeners.get(slug) ?? new Set<NextApiResponse>();
  set.add(res);
  listeners.set(slug, set);
}

export function unsubscribe(slug: string, res: NextApiResponse) {
  const set = listeners.get(slug);
  if (set) {
    set.delete(res);
    if (set.size === 0) listeners.delete(slug);
  }
}

export function publish(slug: string) {
  const set = listeners.get(slug);
  if (!set) return;
  for (const res of set) {
    res.write(`data: update\n\n`);
  }
}
