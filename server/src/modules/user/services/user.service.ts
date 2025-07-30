import bcrypt from "bcrypt";
import prisma from "../../../config/prisma";
import { generateToken } from "../../../utils/token";

export const createUser = async (username: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { username, password: hashedPassword },
  });
};

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({ where: { username } });
};

export const getAllUsers = async () => {
  return prisma.user.findMany();
};

export const login = async (username: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { username } });
    if(!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error('Invalid credentials');

    return {
        user,
        token: generateToken(user.id)
    };
}
