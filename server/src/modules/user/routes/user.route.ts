import { register, listUsers, loginUser, getDashboard } from '@user/controllers/user.controller';
import { protectedRoute } from '@middlewares/auth.middleware';
import { AsyncRouter } from '@utils/AsyncRouter';
import { validate } from '@middlewares/validate.middleware';
import { loginSchema, registerSchema } from '@user/validations/user.validate';

const userRouter = AsyncRouter();

userRouter.post('/register', validate({ body: registerSchema }), register);
userRouter.post('/login', validate({ body: loginSchema }), loginUser);
userRouter.get('/dashboard', protectedRoute, getDashboard);
userRouter.get('/', protectedRoute, listUsers);

export default userRouter;
