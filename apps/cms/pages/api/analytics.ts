import type { NextApiRequest, NextApiResponse } from 'next';
import { getAnalytics } from '../../../lib/transcripts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const analytics = await getAnalytics();
  res.status(200).json(analytics);
}
