import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllUsers() {
  try {
    // Deleta todos os registros da tabela `User`
    const deleteResult = await prisma.user.deleteMany({});
    console.log(`Total de usuários excluídos: ${deleteResult.count}`);
  } catch (error) {
    console.error('Erro ao excluir usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllUsers();
