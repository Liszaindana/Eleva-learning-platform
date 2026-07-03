import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // Cek apakah ada Authorization Header
  if (!authHeader) {
    return res.status(401).json({
      message: "Token tidak ditemukan.",
    });
  }

  // Format harus: Bearer token
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Format token harus Bearer.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token tidak ditemukan.",
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      message: "Server tidak dikonfigurasi dengan benar.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      secret
    );

    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token tidak valid atau sudah kedaluwarsa.",
    });
  }
};