import app from './app';
import { PORT } from '@config/env';
import prisma from '@config/prisma';

async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL via Prisma');

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1); // Exit process if DB connection fails
  }
}

// Handle unexpected shutdown gracefully
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Server terminated.');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
