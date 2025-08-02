import express from 'express';
import cors from 'cors';
import userRouter from '@user/routes/user.route';
import { CLIENT_URL } from '@config/env';
import { requestLogger } from '@middlewares/logger.middleware';
import { errorHandler, notFound } from '@middlewares/error.middleware';

const app = express();

// Middlewares
app.use(
  cors({
    origin: CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/users', userRouter);

// Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
