import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { NotificationEvent, NotificationChannel } from '@prisma/client';

const querySchema = z.object({
  userId: z.coerce.number()
});

const updateSchema = z.object({
  userId: z.number(),
  event: z.nativeEnum(NotificationEvent),
  channel: z.nativeEnum(NotificationChannel),
  enabled: z.boolean().default(true)
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId } = querySchema.parse(req.query);
    const items = await prisma.notificationPreference.findMany({ where: { userId } });
    res.json({ items });
  } else if (req.method === 'POST') {
    const data = updateSchema.parse(req.body);
    await prisma.notificationPreference.upsert({
      where: {
        userId_event_channel: {
          userId: data.userId,
          event: data.event,
          channel: data.channel
        }
      },
      update: { enabled: data.enabled },
      create: data
    });
    res.status(204).end();
  } else {
    res.setHeader('Allow', 'GET,POST');
    res.status(405).end();
  }
}
