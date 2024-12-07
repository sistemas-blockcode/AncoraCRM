import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    if (!userId || Array.isArray(userId)) {
        return res.status(400).json({ error: 'ID do usuário inválido' });
    }

    try {
        // Busca os resumos semanais do vendedor
        const weeklySummaries = await prisma.weeklySummary.findMany({
            where: { userId: parseInt(userId as string) },
            orderBy: { weekStartDate: 'desc' },
        });

        if (!weeklySummaries || weeklySummaries.length === 0) {
            return res.status(404).json({ error: 'Nenhuma métrica encontrada para o vendedor' });
        }

        // Calcula o total e a média semanal
        const totalSales = weeklySummaries.reduce((sum, summary) => sum + summary.totalSales, 0);
        const averageWeeklySales = totalSales / weeklySummaries.length;

        // Busca o resumo semanal com a maior venda
        const highestSaleSummary = weeklySummaries.reduce((max, summary) =>
            summary.highestSaleValue > (max?.highestSaleValue || 0) ? summary : max
        );

        // Estrutura de dados para resposta
        const sellerMetrics = {
            totalSales: `R$ ${totalSales.toFixed(2)}`,
            averageWeeklySales: `R$ ${averageWeeklySales.toFixed(2)}`,
            highestSaleDate: highestSaleSummary?.weekStartDate.toLocaleDateString('pt-BR') || '-',
            highestSaleValue: `R$ ${highestSaleSummary?.highestSaleValue.toFixed(2) || '0,00'}`,
            totalCommission: `R$ ${weeklySummaries.reduce((sum, summary) => sum + (summary.totalCommission || 0), 0).toFixed(2)}`,
            goalAchieved: '80%' // Placeholder para taxa de meta atingida
        };

        res.status(200).json(sellerMetrics);
    } catch (error) {
        console.error('Erro ao buscar métricas do vendedor:', error);
        res.status(500).json({ error: 'Erro ao buscar métricas do vendedor' });
    }
}
