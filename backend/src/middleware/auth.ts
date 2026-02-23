import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthRequest = Request & { userId?: string };

interface TokenPayload extends jwt.JwtPayload {
  userId: string;
}

export const protectRoute = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

if (!token) {
  return res.status(401).json({ message: "Unauthorized" });
}

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as unknown as TokenPayload;

    req.userId = decoded.userId;

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};