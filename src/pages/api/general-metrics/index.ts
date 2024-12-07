import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            // Obtendo todas as vendas, abordagens e resumos semanais sem filtro de loja
            const sales = await prisma.sale.findMany();
            const approaches = await prisma.approach.findMany();

            // Calculando métricas
            const totalApproaches = approaches.reduce((sum, approach) => sum + approach.salesCount, 0);
            const totalSales = sales.length;
            const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalValue, 0);
            const conversionRate = totalApproaches > 0 ? (totalSales / totalApproaches) * 100 : 0;
            const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

            // Retornando as métricas calculadas
            res.status(200).json({
                totalApproaches,
                totalSales,
                conversionRate,
                averageTicket,
            });
        } catch (error) {
            console.error('Erro ao buscar métricas:', error);
            res.status(500).json({ error: 'Erro ao buscar métricas.' });
        }
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
}
