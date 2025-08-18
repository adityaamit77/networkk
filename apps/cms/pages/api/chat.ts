import type { NextApiRequest, NextApiResponse } from 'next';
import { getDocuments } from '../../../lib/sessionIndex';
import { logTranscript, notifyTeam } from '../../../lib/transcripts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { sessionId, message } = req.body || {};
  if (!sessionId || !message) {
    return res.status(400).json({ error: 'missing sessionId or message' });
  }
  const docs = getDocuments(sessionId);
  const citation = docs.length ? { label: '[1]', url: docs[0].url || '#' } : null;
  const answer = docs.length
    ? `According to your document: ${docs[0].text.slice(0, 100)}...`
    : 'No documents found for this session.';
  const response = {
    message: citation ? `${answer} ${citation.label}` : answer,
    citations: citation ? [citation] : [],
  };
  await logTranscript(sessionId, [
    { role: 'user', content: message },
    { role: 'assistant', content: response.message },
  ]);
  if (message.toLowerCase().includes('escalate')) {
    notifyTeam(sessionId);
  }
  res.status(200).json(response);
}
