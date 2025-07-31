import bcrypt from 'bcrypt';
import prisma from '../../../config/prisma';
import { generateToken } from '../../../utils/token';

export const checkUserExists = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};

export const createUser = async (username: string, password: string) => {
  const existingUser = await checkUserExists(username);
  if (existingUser) {
    throw new Error('Username already taken!');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { username, password: hashedPassword },
  });

  return {
    id: newUser.id,
    username: newUser.username,
    createdAt: newUser.createdAt,
  };
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, createdAt: true },
  });
};

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, username: true, createdAt: true },
  });
};

export const login = async (username: string, password: string) => {
  const user = await checkUserExists(username);
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  return {
    token: generateToken(user.id),
    user: {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
    },
  };
};
