import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, storeId, date, salesCount, piecesPerSale } = req.body;
    
    try {
      const approach = await prisma.approach.create({
        data: {
          date: new Date(date),
          userId,
          storeId,
          salesCount,
          piecesPerSale,
        },
      });
      res.status(201).json(approach);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar abordagem' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
