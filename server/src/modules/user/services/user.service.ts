import bcrypt from 'bcrypt';
import prisma from '@config/prisma';
import { generateToken } from '@utils/token';
import { CreateUserDTO, UserResponse } from '@user/types/user.type';
import { AppError } from '@utils/AppError';

export const checkUserExists = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};

export const createUser = async (data: CreateUserDTO): Promise<UserResponse> => {
  const existingUser = await checkUserExists(data.username);
  if (existingUser) {
    throw new AppError('Username already taken!', 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = await prisma.user.create({
    data: { username: data.username, password: hashedPassword },
  });

  return {
    id: newUser.id,
    username: newUser.username,
    createdAt: newUser.createdAt,
  };
};

export const findUserByUsername = async (username: string): Promise<UserResponse | null> => {
  const user = await prisma.user.findUnique({ where: { username } });
  return user ? { id: user.id, username: user.username, createdAt: user.createdAt } : null;
};

export const findUserById = async (id: string): Promise<UserResponse | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, createdAt: true },
  });
  return user ? { id: user.id, username: user.username, createdAt: user.createdAt } : null;
};

export const getAllUsers = async (): Promise<UserResponse[]> => {
  const users = await prisma.user.findMany();
  return users.map((user) => ({
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  }));
};

export const login = async (username: string, password: string) => {
  const user = await checkUserExists(username);
  if (!user) throw new AppError('Invalid credentials', 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  return {
    token: generateToken(user.id),
    user: {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    },
  };
};
