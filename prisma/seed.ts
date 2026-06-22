import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('password123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@factorotc.com' },
    update: {},
    create: {
      email: 'admin@factorotc.com',
      password: adminPassword,
      name: 'Admin Factor OTC',
      role: 'ADMIN',
      preferredLanguage: 'ca',
    },
  });
  console.log('Created admin:', admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'usuari@factorotc.com' },
    update: {},
    create: {
      email: 'usuari@factorotc.com',
      password: userPassword,
      name: 'Joan Garcia',
      role: 'USER',
      preferredLanguage: 'ca',
      phone: '+34 600 123 456',
    },
  });
  console.log('Created user:', user.email);

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
