// pages/api/users/getUsers.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Verifica o token para autenticação
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };

    // Busca e retorna todos os usuários
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        phone: true,
        profilePicture: true,
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro na autenticação do token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
}
