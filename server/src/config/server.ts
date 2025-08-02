import http from 'http';
import prisma from '@config/prisma';
import app from '../app';

class Server {
  private static instance: Server;
  private server?: http.Server;
  private isShuttingDown = false;

  private constructor() {}

  public static getInstance(): Server {
    if (!Server.instance) {
      Server.instance = new Server();
    }
    return Server.instance;
  }

  public async start(port: number) {
    try {
      await prisma.$connect();
      console.log('✅ Connected to PostgreSQL via Prisma');

      this.server = app.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      await prisma.$disconnect();
      process.exit(1);
    }
  }

  public async shutdown(signal: string) {
    if (this.isShuttingDown) return; // ✅ Prevent double shutdown
    this.isShuttingDown = true;

    console.log(`🛑 Received ${signal}. Shutting down gracefully...`);

    // Force exit if shutdown takes too long (10 seconds)
    const forceExit = setTimeout(() => {
      console.error('❌ Shutdown timed out. Forcing exit.');
      process.exit(1);
    }, 10_000);

    try {
      if (this.server) {
        await new Promise<void>((resolve, reject) => {
          this.server!.close((err) => {
            if (err) return reject(err);
            resolve();
          });
        });
        console.log('✅ HTTP server closed.');
      }

      await prisma.$disconnect();
      console.log('✅ Prisma disconnected.');

      clearTimeout(forceExit); // ✅ Cancel force-exit if cleanup succeeded
      process.exit(0);
    } catch (err) {
      console.error('❌ Error during shutdown:', err);
      clearTimeout(forceExit);
      process.exit(1);
    }
  }
}

export default Server;
