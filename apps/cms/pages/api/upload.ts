import type { NextApiRequest, NextApiResponse } from 'next';
import { addDocument } from '../../../lib/sessionIndex';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { sessionId, text, url } = req.body || {};
  if (!sessionId || !text) {
    return res.status(400).json({ error: 'missing sessionId or text' });
  }
  addDocument(sessionId, text, url);
  res.status(200).json({ ok: true });
}
