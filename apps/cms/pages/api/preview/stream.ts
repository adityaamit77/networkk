import type { NextApiRequest, NextApiResponse } from 'next';
import { subscribe, unsubscribe } from '@/lib/preview';

export const config = {
  api: {
    bodyParser: false
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = (req.query.slug as string) ?? '/';
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.write('\n');
  subscribe(slug, res);
  req.on('close', () => {
    unsubscribe(slug, res);
  });
}
