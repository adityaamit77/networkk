import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { publish } from '@/lib/preview';

const idSchema = z.object({ id: z.coerce.number() });

const updateSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  seo: z.any().optional(),
  blocks: z.any().optional()
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = idSchema.parse(req.query);
  if (req.method === 'GET') {
    const page = await prisma.page.findUnique({ where: { id } });
    if (!page) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Page not found' } });
    res.json(page);
  } else if (req.method === 'PUT') {
    const data = updateSchema.parse(req.body);
    const existing = await prisma.page.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Page not found' } });
    const page = await prisma.page.update({ where: { id }, data });
    await prisma.revision.create({
      data: {
        entityType: 'Page',
        entityId: id,
        snapshot: existing,
      }
    });
    publish(page.slug);
    res.json(page);
  } else {
    res.setHeader('Allow', 'GET,PUT');
    res.status(405).end();
  }
}
