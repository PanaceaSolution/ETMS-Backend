import { Router } from 'express';
import { register, listUsers, loginUser, getDashboard } from '../controllers/user.controller';
import { protectedRoute } from '../../../middlewares/auth.middleware';

const userRouter = Router();

userRouter.post('/register', register);
userRouter.post('/login', loginUser);
userRouter.get('/dashboard', protectedRoute, getDashboard);
userRouter.get('/', protectedRoute, listUsers);

export default userRouter;
