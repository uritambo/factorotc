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

  // Subscripció activa per a l'usuari de prova (permet passar el paywall)
  const renewalDate = new Date();
  renewalDate.setMonth(renewalDate.getMonth() + 1);
  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: { status: 'ACTIVE', renewalDate },
    create: {
      userId: user.id,
      status: 'ACTIVE',
      plan: 'monthly',
      startDate: new Date(),
      renewalDate,
    },
  });
  console.log('Created active subscription for:', user.email);

  // Cartera amb posicions d'exemple (mateixos valors que lib/mockData.ts)
  const portfolio = await prisma.portfolio.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });

  const positions = [
    { ticker: 'ITX', companyName: 'Inditex', quantity: 150, avgBuyPrice: 32.4 },
    { ticker: 'IBE', companyName: 'Iberdrola', quantity: 400, avgBuyPrice: 11.2 },
    { ticker: 'AAPL', companyName: 'Apple Inc.', quantity: 20, avgBuyPrice: 142.5 },
    { ticker: 'MC', companyName: 'LVMH Moët Hennessy', quantity: 10, avgBuyPrice: 680.0 },
    { ticker: 'SAN', companyName: 'Banco Santander', quantity: 800, avgBuyPrice: 3.85 },
    { ticker: 'MSFT', companyName: 'Microsoft Corp.', quantity: 15, avgBuyPrice: 295.0 },
  ];

  await prisma.position.deleteMany({ where: { portfolioId: portfolio.id } });
  await prisma.position.createMany({
    data: positions.map((p) => ({ ...p, portfolioId: portfolio.id })),
  });
  console.log(`Created ${positions.length} positions`);

  // Notícies d'exemple (algunes publicades, una pendent de revisió)
  const hoursAgo = (h: number) => new Date(Date.now() - h * 3600000);
  const articles = [
    {
      title: 'Inditex supera expectatives amb un creixement del 15% en vendes',
      summary: 'El gegant tèxtil supera les previsions dels analistes gràcies a la forta demanda a Àsia i Amèrica del Nord.',
      source: 'Expansió',
      url: '#',
      relatedTickers: ['ITX'],
      publishedAt: hoursAgo(2),
      status: 'PUBLISHED' as const,
    },
    {
      title: 'Iberdrola accelera la seva transformació renovable amb nous projectes eòlics',
      summary: "La utility espanyola anuncia una inversió de 3.000 milions d'euros en nous parcs eòlics marins.",
      source: 'Cinco Días',
      url: '#',
      relatedTickers: ['IBE'],
      publishedAt: hoursAgo(5),
      status: 'PUBLISHED' as const,
    },
    {
      title: 'El Banc Central Europeu manté els tipus d\'interès',
      summary: "El BCE manté els tipus de referència al 3,5% a l'espera de confirmar la tendència desinflacionista.",
      source: 'La Vanguardia',
      url: '#',
      relatedTickers: [],
      publishedAt: hoursAgo(48),
      status: 'PUBLISHED' as const,
    },
    {
      title: "L'IBEX 35 tanca la seva millor setmana en dos mesos",
      summary: "L'índex de referència espanyol puja un 2,8% setmanal impulsat pel sector bancari.",
      source: 'Expansió',
      url: '#',
      relatedTickers: ['SAN', 'IBE', 'ITX'],
      publishedAt: hoursAgo(60),
      status: 'PENDING' as const,
    },
  ];

  await prisma.newsArticle.deleteMany({});
  await prisma.newsArticle.createMany({ data: articles });
  console.log(`Created ${articles.length} news articles`);

  // Historial de mentories d'exemple
  const daysFromNow = (d: number) => new Date(Date.now() + d * 86400000);
  await prisma.mentoringSession.deleteMany({ where: { userId: user.id } });
  await prisma.mentoringSession.createMany({
    data: [
      {
        userId: user.id,
        scheduledAt: daysFromNow(-30),
        status: 'COMPLETED',
        type: 'FREE_REPORT',
        price: 0,
      },
      {
        userId: user.id,
        scheduledAt: daysFromNow(-7),
        status: 'COMPLETED',
        type: 'EXTRA_MENTORING',
        price: 20,
      },
      {
        userId: user.id,
        scheduledAt: daysFromNow(3),
        status: 'SCHEDULED',
        type: 'EXTRA_MENTORING',
        price: 20,
      },
    ],
  });
  console.log('Created mentoring sessions');

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
