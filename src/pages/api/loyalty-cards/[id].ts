import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    console.log(`[REQUEST] ${req.method} - /api/loyalty-cards/${id}`);

    if (req.method === 'GET') {
      console.log('[GET] Buscando cartão de fidelidade.');

      const loyaltyCard = await prisma.loyaltyCard.findUnique({
        where: { id: Number(id) },
      });

      if (!loyaltyCard) {
        console.error(`[GET ERROR] Cartão de fidelidade com ID ${id} não encontrado.`);
        return res.status(404).json({ message: 'Loyalty card not found' });
      }

      console.log(`[GET] Cartão encontrado: ${JSON.stringify(loyaltyCard)}`);
      return res.status(200).json(loyaltyCard);
    }

    if (req.method === 'PUT') {
      const token = req.cookies.token;
      if (!token) {
        console.error('[AUTH ERROR] Token não fornecido.');
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
      const userId = decoded.userId;
      console.log(`[AUTH] Token validado com sucesso. Usuário ID: ${userId}`);

      const { points, stamps } = req.body;
      console.log(`[PUT] Atualizando cartão. ID: ${id}, Pontos: ${points}, Marcas: ${stamps}`);

      // Buscar o estado atual do cartão
      const currentCard = await prisma.loyaltyCard.findUnique({
        where: { id: Number(id) },
      });

      if (!currentCard) {
        console.error(`[PUT ERROR] Cartão de fidelidade com ID ${id} não encontrado.`);
        return res.status(404).json({ message: 'Loyalty card not found' });
      }

      console.log(`[PUT] Estado atual do cartão: ${JSON.stringify(currentCard)}`);

      const stampsAdded = stamps - currentCard.stamps;
      console.log(`[PUT] Diferença de marcas calculada: ${stampsAdded}`);

      // Atualizar o cartão de fidelidade
      const loyaltyCard = await prisma.loyaltyCard.update({
        where: { id: Number(id) },
        data: { points, stamps },
      });

      console.log(`[PUT] Cartão atualizado: ${JSON.stringify(loyaltyCard)}`);

      // Registrar no histórico se houver alteração de marcas
      if (stampsAdded !== 0) {
        console.log(`[PUT] Registrando no histórico. Usuário: ${userId}, Marcas adicionadas: ${stampsAdded}`);

        const historyEntry = await prisma.loyaltyCardHistory.create({
          data: {
            loyaltyCardId: Number(id),
            stampsAdded,
            userId,
          },
        });

        console.log(`[PUT] Histórico registrado: ${JSON.stringify(historyEntry)}`);
      } else {
        console.log('[PUT] Nenhuma alteração de marcas. Histórico não foi atualizado.');
      }

      return res.status(200).json(loyaltyCard);
    }

    if (req.method === 'PATCH') {
      console.log(`[PATCH] Resetando marcas para o cartão de ID: ${id}`);

      const loyaltyCard = await prisma.loyaltyCard.update({
        where: { id: Number(id) },
        data: { stamps: 0 },
      });

      console.log(`[PATCH] Marcas resetadas com sucesso: ${JSON.stringify(loyaltyCard)}`);
      return res.status(200).json(loyaltyCard);
    }

    res.setHeader('Allow', ['GET', 'PUT', 'PATCH']);
    console.warn(`[METHOD NOT ALLOWED] Método ${req.method} não permitido.`);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('[INTERNAL SERVER ERROR]', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
