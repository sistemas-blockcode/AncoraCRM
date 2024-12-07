import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Pietro@272', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'pietrosantos@blockcode.online' },
    update: {},
    create: {
      name: 'Pietro Dev',
      phone: '(11)98014-1941',
      email: 'pietrosantos@blockcode.online',
      password: hashedPassword,
      role: 'ADMINISTRADOR',
    },
  });

  console.log('Usuário administrador criado:', adminUser);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
