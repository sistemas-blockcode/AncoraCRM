import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const customers = await prisma.customer.findMany({
        include: {
          loyaltyCard: true,
        },
      });
      return res.status(200).json(customers);
    }

    if (req.method === 'POST') {
      const { name, cpf, birthDate, phoneNumber, email } = req.body;

      const customer = await prisma.customer.create({
        data: {
          name,
          cpf, 
          birthDate: new Date(birthDate),
          phoneNumber,
          email,
          loyaltyCard: {
            create: {},
          },
        },
        include: {
          loyaltyCard: true,
        },
      });

      return res.status(201).json(customer);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
