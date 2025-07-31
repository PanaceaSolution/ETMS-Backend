import { Response } from 'express';
import * as userService from '../services/user.service';
import { AppError } from '../../../utils/AppError';
import { AuthenticatedRequest } from '../../../middlewares/auth.middleware';

export const register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await userService.createUser(username, password);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user,
    });
  } catch (err: unknown) {
    console.error('Register error:', err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(400).json({ success: false, message: 'Registration failed' });
  }
};

export const listUsers = async (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, users });
  } catch (err: unknown) {
    console.error('List users error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const loginUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password } = req.body;
    const data = await userService.login(username, password);
    res.json({ success: true, ...data });
  } catch (err: unknown) {
    console.error('Login error:', err);
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

export const getDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await userService.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Authenticated user retrieved successfully',
      user,
    });
  } catch (err: unknown) {
    console.error('Dashboard error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
