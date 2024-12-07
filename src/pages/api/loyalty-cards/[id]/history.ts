import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    // Log inicial para monitorar a requisição recebida
    console.log(`[REQUEST] ${req.method} - /api/loyalty-cards/${id}/history`);

    // Verificar autenticação via token
    const token = req.cookies.token;
    if (!token) {
      console.error('[AUTH ERROR] Token não fornecido.');
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    const userId = decoded.userId;
    console.log(`[AUTH] Token validado com sucesso. Usuário ID: ${userId}`);

    if (req.method === 'GET') {
      console.log('[GET] Buscando histórico do cartão de fidelidade.');

      // Buscar histórico no banco de dados
      const loyaltyCardHistory = await prisma.loyaltyCardHistory.findMany({
        where: { loyaltyCardId: Number(id) },
        include: { user: { select: { name: true } } },
        orderBy: { dateAdded: 'desc' },
      });

      console.log(`[GET] Histórico retornado com sucesso: ${JSON.stringify(loyaltyCardHistory)}`);
      return res.status(200).json(loyaltyCardHistory);
    }

    if (req.method === 'PUT') {
      const { points, stamps } = req.body;
      console.log(`[PUT] Atualizando cartão de fidelidade. ID: ${id}, Pontos: ${points}, Marcas: ${stamps}`);

      // Buscar estado atual do cartão
      const currentCard = await prisma.loyaltyCard.findUnique({
        where: { id: Number(id) },
      });

      if (!currentCard) {
        console.error(`[PUT ERROR] Cartão de fidelidade com ID ${id} não encontrado.`);
        return res.status(404).json({ message: 'Loyalty card not found' });
      }

      console.log(`[PUT] Cartão atual encontrado: ${JSON.stringify(currentCard)}`);

      const stampsAdded = stamps - currentCard.stamps;
      console.log(`[PUT] Diferença de marcas calculada: ${stampsAdded}`);

      // Atualizar o cartão de fidelidade
      const loyaltyCard = await prisma.loyaltyCard.update({
        where: { id: Number(id) },
        data: { points, stamps },
      });

      console.log(`[PUT] Cartão atualizado com sucesso: ${JSON.stringify(loyaltyCard)}`);

      // Registrar no histórico se houver alteração de marcas
      if (stampsAdded !== 0) {
        console.log(`[PUT] Registrando alteração no histórico. Usuário: ${userId}, Cartão: ${id}, Marcas adicionadas: ${stampsAdded}`);

        const historyEntry = await prisma.loyaltyCardHistory.create({
          data: {
            loyaltyCardId: Number(id),
            stampsAdded,
            userId,
          },
        });

        console.log(`[PUT] Histórico registrado com sucesso: ${JSON.stringify(historyEntry)}`);
      } else {
        console.log('[PUT] Nenhuma alteração de marcas detectada. Histórico não foi atualizado.');
      }

      return res.status(200).json(loyaltyCard);
    }

    res.setHeader('Allow', ['GET', 'PUT']);
    console.warn(`[METHOD NOT ALLOWED] Método ${req.method} não permitido.`);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error('[INTERNAL SERVER ERROR]', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
