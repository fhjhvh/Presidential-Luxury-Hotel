import { PrismaClient } from '@prisma/client';

const isDev = process.env.NODE_ENV !== 'production';

const prisma = new PrismaClient({
  log: isDev ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
