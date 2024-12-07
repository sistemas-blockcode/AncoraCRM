import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, startDate, endDate } = req.query;

  if (req.method === 'GET') {
    try {
      const weeklySummary = await prisma.weeklySummary.findMany({
        where: {
          userId: userId ? parseInt(userId as string) : undefined,
          weekStartDate: startDate ? new Date(startDate as string) : undefined,
          weekEndDate: endDate ? new Date(endDate as string) : undefined,
        },
      });
      res.status(200).json(weeklySummary);
    } catch (error) {
      console.error('Erro ao obter métricas semanais:', error);
      res.status(500).json({ error: 'Erro ao obter métricas semanais' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
