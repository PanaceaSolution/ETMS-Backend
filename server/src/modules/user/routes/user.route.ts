import { register, listUsers, loginUser, getDashboard } from '@user/controllers/user.controller';
import { protectedRoute } from '@middlewares/auth.middleware';
import { AsyncRouter } from '@utils/AsyncRouter';

const userRouter = AsyncRouter();

userRouter.post('/register', register);
userRouter.post('/login', loginUser);
userRouter.get('/dashboard', protectedRoute, getDashboard);
userRouter.get('/', protectedRoute, listUsers);

export default userRouter;
