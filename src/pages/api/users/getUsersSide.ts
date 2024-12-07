// pages/api/users/getUser.ts
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

    // Busca o usuário específico com base no ID decodificado do token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Erro na autenticação do token:', error);
    return res.status(401).json({ error: 'Token inválido' });
  }
}
