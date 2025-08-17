import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const querySchema = z.object({
  slug: z.string(),
  draft: z.string().optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = querySchema.parse(req.query);
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Page not found' } });
    return;
  }
  res.json(page);
}
