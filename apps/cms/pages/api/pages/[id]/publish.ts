import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { publish as notifyPreview } from '@/lib/preview';

const paramsSchema = z.object({ id: z.coerce.number() });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = paramsSchema.parse(req.query);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const existing = await prisma.page.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Page not found' } });
  }

  const page = await prisma.page.update({
    where: { id },
    data: { status: 'PUBLISHED', publishedAt: new Date() }
  });

  await prisma.revision.create({
    data: {
      entityType: 'Page',
      entityId: id,
      snapshot: existing
    }
  });

  // Notify preview subscribers; export/deploy hook would be triggered here.
  notifyPreview(page.slug);

  res.json({ id: page.id });
}
