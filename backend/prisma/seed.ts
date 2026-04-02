import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@cinema.com' },
    update: {},
    create: {
      nome: 'Administrador',
      email: 'admin@cinema.com',
      senha: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin criado:', admin.email);

  // Create some genres
  const generos = ['Ação', 'Comédia', 'Drama', 'Terror', 'Ficção Científica', 'Romance', 'Animação'];
  for (const nome of generos) {
    await prisma.genero.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }
  console.log('Gêneros criados:', generos.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
