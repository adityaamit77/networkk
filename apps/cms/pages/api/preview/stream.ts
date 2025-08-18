import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { subscribe, unsubscribe } from '@/lib/preview';

export const config = {
  api: {
    bodyParser: false
  }
};

const querySchema = z.object({ slug: z.string().default('/') });

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = querySchema.parse(req.query);
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
    Connection: 'keep-alive',
    'X-Robots-Tag': 'noindex'
  });
  res.write('\n');
  subscribe(slug, res);
  req.on('close', () => {
    unsubscribe(slug, res);
  });
}
