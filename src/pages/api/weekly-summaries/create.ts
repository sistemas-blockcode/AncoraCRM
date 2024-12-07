// Código ajustado para definir o userId como 2 diretamente
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      // userId está fixado em 2, então não vamos extrair ele do req.body
      weekStartDate,
      weekEndDate,
      totalSales = 0,
      averageTicket = 0,
      conversionRate = 0,
      highestSaleValue = 0,
      totalPiecesSold = 0,
      piecesPerSale = 0,
      totalApproaches = 0,
      totalCommission = 0,
    } = req.body;

    // Define o userId como 2
    const parsedUserId = 2;
    const parsedWeekStartDate = new Date(weekStartDate);
    const parsedWeekEndDate = new Date(weekEndDate);

    // Validação dos campos obrigatórios
    if (!weekStartDate || !weekEndDate) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes: weekStartDate ou weekEndDate' });
    }

    if (isNaN(parsedWeekStartDate.getTime()) || isNaN(parsedWeekEndDate.getTime())) {
      return res.status(400).json({ error: 'Formato inválido para as datas (weekStartDate, weekEndDate)' });
    }

    // Verifica se o usuário com id 2 existe no banco de dados
    const userExists = await prisma.user.findUnique({
      where: { id: parsedUserId },
    });

    if (!userExists) {
      return res.status(400).json({ error: 'Usuário com id 2 não encontrado' });
    }

    try {
      const summary = await prisma.weeklySummary.upsert({
        where: {
          userId_weekStartDate: {
            userId: parsedUserId,
            weekStartDate: parsedWeekStartDate,
          },
        },
        update: {
          totalSales,
          averageTicket,
          conversionRate,
          highestSaleValue,
          totalPiecesSold,
          piecesPerSale,
          totalApproaches,
          totalCommission,
        },
        create: {
          userId: parsedUserId,
          weekStartDate: parsedWeekStartDate,
          weekEndDate: parsedWeekEndDate,
          totalSales,
          averageTicket,
          conversionRate,
          highestSaleValue,
          totalPiecesSold,
          piecesPerSale,
          totalApproaches,
          totalCommission,
        },
      });
      res.status(201).json(summary);
    } catch (error) {
      console.error('Erro ao criar resumo semanal:', error);
      res.status(500).json({ error: 'Erro ao criar resumo semanal' });
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' });
  }
}
