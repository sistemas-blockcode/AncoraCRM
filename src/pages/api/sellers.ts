// pages/api/sellers.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {
        try {
            const sellers = await prisma.user.findMany({
                where: { role: 'VENDEDOR' },
                select: { id: true, name: true },
            });
            res.status(200).json(sellers);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar vendedores' });
        }
    } else {
        res.status(405).json({ error: 'Método não permitido' });
    }
};
