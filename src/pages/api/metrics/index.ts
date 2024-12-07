// pages/api/metrics/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      const { month, year } = req.query;
      if (!month || !year) {
        return res.status(400).json({ error: 'Mês e ano são necessários' });
      }

      try {
        const metrics = await prisma.monthlyMetrics.findUnique({
          where: {
            month_year: {
              month: parseInt(month as string),
              year: parseInt(year as string),
            },
          },
        });

        if (!metrics) {
          // Retorna um objeto zerado caso não existam dados para o mês/ano
          return res.status(200).json({
            dinheiro: 0,
            cartaoTef: 0,
            linkCartao: 0,
            pix: 0,
            cheque: 0,
            crediario: 0,
          });
        }

        return res.status(200).json(metrics); // Retorna diretamente o objeto de métricas
      } catch (error) {
        console.error('Erro ao buscar métricas mensais:', error);
        return res.status(500).json({ error: 'Erro ao buscar métricas mensais' });
      }

    case 'POST':
      const { month: postMonth, year: postYear, values } = req.body;
      if (!postMonth || !postYear || !values) {
        return res.status(400).json({ error: 'Dados incompletos' });
      }

      try {
        const updatedMetrics = await prisma.monthlyMetrics.upsert({
          where: {
            month_year: {
              month: postMonth,
              year: postYear,
            },
          },
          update: values,
          create: {
            month: postMonth,
            year: postYear,
            ...values,
          },
        });

        return res.status(200).json(updatedMetrics);
      } catch (error) {
        console.error('Erro ao atualizar métricas mensais:', error);
        return res.status(500).json({ error: 'Erro ao atualizar métricas' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Método ${method} não permitido`);
  }
}
