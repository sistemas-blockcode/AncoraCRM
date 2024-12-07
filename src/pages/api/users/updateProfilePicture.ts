import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import formidable, { File } from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file: File): Promise<string> => {
  const data = await fs.readFile(file.filepath);
  const fileName = file.originalFilename || 'profile.jpg';
  const uploadPath = path.join(process.cwd(), 'public/uploads', fileName);
  await fs.writeFile(uploadPath, data);
  console.log(`File saved at: ${uploadPath}`); // Log para verificar o caminho do arquivo salvo
  return `/uploads/${fileName}`;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Request method: ${req.method}`); // Log do método da requisição
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing form:', err);
      return res.status(500).json({ message: 'Erro no upload do arquivo' });
    }

    console.log('Fields:', fields); // Log dos campos recebidos
    console.log('Files:', files); // Log dos arquivos recebidos
    
    const userIdStr = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    const userId = parseInt(userIdStr || '', 10);
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || isNaN(userId)) {
      console.error('Invalid data - missing file or userId');
      return res.status(400).json({ message: 'Dados inválidos' });
    }

    try {
      const filePath = await saveFile(file as File);

      // Atualização no banco de dados
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { profilePicture: filePath },
      });

      console.log('User profile picture updated:', updatedUser); // Log do usuário atualizado
      return res.status(200).json({ message: 'Foto de perfil atualizada', profilePicture: filePath });
    } catch (error) {
      console.error('Error updating profile picture:', error);
      return res.status(500).json({ message: 'Erro ao atualizar a foto de perfil' });
    }
  });
}
