import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { cpf } = req.query;

      if (!cpf) {
        return res.status(400).json({ message: 'CPF é obrigatório para a pesquisa.' });
      }

      const customer = await prisma.customer.findFirst({
        where: { cpf: String(cpf) },
        include: {
          loyaltyCard: true,
        },
      });

      if (!customer) {
        return res.status(404).json({ message: 'Cliente não encontrado.' });
      }

      return res.status(200).json(customer);
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Método ${req.method} não permitido.` });
  } catch (error) {
    console.error('Erro ao pesquisar cliente:', error);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}
