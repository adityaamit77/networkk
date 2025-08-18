import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { NotificationEvent, NotificationChannel } from '@prisma/client';

const querySchema = z.object({
  userId: z.coerce.number().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  offset: z.coerce.number().min(0).optional()
});

const createSchema = z.object({
  userId: z.number().optional(),
  templateId: z.number(),
  data: z.any().default({})
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { userId, limit, offset } = querySchema.parse(req.query);
    const where: any = {};
    if (userId) where.userId = userId;
    const items = await prisma.notification.findMany({ where, skip: offset, take: limit });
    const total = await prisma.notification.count({ where });
    res.json({ items, total });
  } else if (req.method === 'POST') {
    const { userId, templateId, data } = createSchema.parse(req.body);
    const template = await prisma.notificationTemplate.findUnique({ where: { id: templateId } });
    if (!template) {
      res.status(400).json({ error: 'Invalid template' });
      return;
    }
    const notification = await prisma.notification.create({
      data: {
        userId,
        templateId,
        event: template.event,
        channel: template.channel,
        data
      }
    });
    await prisma.notificationAudit.create({
      data: {
        notificationId: notification.id,
        event: template.event,
        message: 'created'
      }
    });
    res.status(201).json({ id: notification.id });
  } else {
    res.setHeader('Allow', 'GET,POST');
    res.status(405).end();
  }
}
