import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, storeId, date, totalValue, piecesSold, conversionRate } = req.body;

    try {
      const sale = await prisma.sale.create({
        data: {
          date: new Date(date),
          userId,
          storeId,
          totalValue,
          piecesSold,
          conversionRate,
        },
      });
      res.status(201).json(sale);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar venda' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
