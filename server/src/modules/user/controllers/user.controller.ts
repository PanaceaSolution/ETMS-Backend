import { Request, Response } from 'express';
import * as userService from '@user/services/user.service';
import { AppError } from '@utils/AppError';
import { AuthenticatedRequest } from '#types/auth';
import { CreateUserDTO, UserApiResponse } from '@user/types/user.type';

export const register = async (req: Request, res: Response<UserApiResponse>) => {
  const { username, password } = req.body as CreateUserDTO;
  const user = await userService.createUser({ username, password });
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: user,
  });
};

export const listUsers = async (_req: Request, res: Response<UserApiResponse>) => {
  const users = await userService.getAllUsers();
  res.json({ success: true, message: 'User fetched', data: users });
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body as CreateUserDTO;
  const data = await userService.login(username, password);
  res.json({ success: true, message: 'Login successful', ...data });
};

export const getDashboard = async (req: AuthenticatedRequest, res: Response<UserApiResponse>) => {
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
    data: user,
  });
};
