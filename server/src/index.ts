import { PORT } from '@config/env';
import Server from '@config/server';

const port = PORT;
const server = Server.getInstance();

server.start(port);

// Graceful shutdown
process.on('SIGINT', () => server.shutdown('SIGINT'));
process.on('SIGTERM', () => server.shutdown('SIGTERM'));

// Global error handling
process.on('uncaughtException', async (err) => {
  console.error('❌ Uncaught Exception:', err);
  await server.shutdown('uncaughtException');
});

process.on('unhandledRejection', async (reason) => {
  console.error('❌ Unhandled Rejection:', reason);
  await server.shutdown('unhandledRejection');
});
