import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/token";

export const protectedRoute = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = verifyToken(token);
        (req as any).userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
}