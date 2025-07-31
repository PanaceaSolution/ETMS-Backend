import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await userService.createUser(username, password);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
};

export const listUsers = async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const data = await userService.login(username, password);
    res.json(data);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const user = await userService.findUserByUsername((req as any).userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Authenticated user retrieved successfully',
      user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
