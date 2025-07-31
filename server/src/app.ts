import express from 'express';
import cors from 'cors';

import userRouter from './modules/user/routes/user.route';
import { CLIENT_URL } from './config/env';
import { logger } from './middlewares/logger';
import { errorHandler, notFound } from './middlewares/error.middleware';

const app = express();

// Middleware
app.use(
  cors({
    origin: CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/users', userRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
