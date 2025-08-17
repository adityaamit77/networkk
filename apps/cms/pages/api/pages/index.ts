import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const querySchema = z.object({
  status: z.string().optional(),
  q: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional()
});

const createSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  seo: z.any().default({}),
  blocks: z.any().default([])
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { status, q, limit, offset } = querySchema.parse(req.query);
    const where: any = {};
    if (status) where.status = status;
    if (q) where.title = { contains: q, mode: 'insensitive' };
    const items = await prisma.page.findMany({ where, skip: offset, take: limit });
    const total = await prisma.page.count({ where });
    res.json({ items, total });
  } else if (req.method === 'POST') {
    const data = createSchema.parse(req.body);
    const page = await prisma.page.create({ data });
    res.status(201).json({ id: page.id });
  } else {
    res.setHeader('Allow', 'GET,POST');
    res.status(405).end();
  }
}
