import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { month, year, weekData } = req.body;
  if (!month || !year || !weekData) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  try {
    const metrics = await prisma.monthlyMetrics.findUnique({
      where: {
        month_year: {
          month,
          year,
        },
      },
    });

    if (!metrics) {
      return res.status(404).json({ error: 'Métricas mensais não encontradas' });
    }

    // Calcula o total de cada campo somando a semana
    const updatedValues = {
      dinheiro: metrics.dinheiro + weekData.dinheiro,
      cartaoTef: metrics.cartaoTef + weekData.cartaoTef,
      pitCard: metrics.pitCard + weekData.pitCard,
      brasilCard: metrics.brasilCard + weekData.brasilCard,
      linkCartao: metrics.linkCartao + weekData.linkCartao,
      pix: metrics.pix + weekData.pix,
      cheque: metrics.cheque + weekData.cheque,
      crediario: metrics.crediario + weekData.crediario,
    };

    const updatedMetrics = await prisma.monthlyMetrics.update({
      where: {
        month_year: {
          month,
          year,
        },
      },
      data: updatedValues,
    });

    return res.status(200).json(updatedMetrics);
  } catch (error) {
    console.error('Erro ao atualizar métricas semanais:', error);
    return res.status(500).json({ error: 'Erro interno ao atualizar métricas' });
  }
}
