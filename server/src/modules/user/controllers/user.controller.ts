import { Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../../../utils/AppError';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

export const register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await userService.createUser(username, password);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const data = await userService.login(username, password);
    res.json({ success: true, ...data });
  } catch (err) {
    next(err);
  }
};

export const getDashboard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.userId) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await userService.findUserById(req.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      message: 'Authenticated user retrieved successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
};
