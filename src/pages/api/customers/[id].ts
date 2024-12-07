import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    if (req.method === 'GET') {
      const customer = await prisma.customer.findUnique({
        where: { id: Number(id) },
        include: { loyaltyCard: true },
      });

      if (!customer) return res.status(404).json({ message: 'Customer not found' });

      return res.status(200).json(customer);
    }

    if (req.method === 'PUT') {
      const { name, birthDate, phoneNumber, email } = req.body;

      const customer = await prisma.customer.update({
        where: { id: Number(id) },
        data: { name, birthDate: new Date(birthDate), phoneNumber, email },
        include: { loyaltyCard: true },
      });

      return res.status(200).json(customer);
    }

    if (req.method === 'DELETE') {
      await prisma.customer.delete({ where: { id: Number(id) } });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
