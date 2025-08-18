import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { NotificationEvent, NotificationChannel } from '@prisma/client';

const querySchema = z.object({
  event: z.nativeEnum(NotificationEvent).optional(),
  channel: z.nativeEnum(NotificationChannel).optional()
});

const createSchema = z.object({
  event: z.nativeEnum(NotificationEvent),
  channel: z.nativeEnum(NotificationChannel),
  subject: z.string().optional(),
  body: z.string().min(1)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { event, channel } = querySchema.parse(req.query);
    const where: any = {};
    if (event) where.event = event;
    if (channel) where.channel = channel;
    const items = await prisma.notificationTemplate.findMany({ where });
    res.json({ items });
  } else if (req.method === 'POST') {
    const data = createSchema.parse(req.body);
    const template = await prisma.notificationTemplate.create({ data });
    res.status(201).json({ id: template.id });
  } else {
    res.setHeader('Allow', 'GET,POST');
    res.status(405).end();
  }
}
