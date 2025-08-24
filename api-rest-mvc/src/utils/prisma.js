const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Middleware para conectar/desconectar automaticamente
prisma.$connect()
  .then(() => {
    console.log('✅ Prisma Client conectado ao banco de dados');
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar Prisma Client:', error);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
