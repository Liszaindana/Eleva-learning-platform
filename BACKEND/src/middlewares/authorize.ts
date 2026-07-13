import type { Request, Response, NextFunction } from "express";

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized. Silakan login terlebih dahulu.",
      });
    }

    // 💡 Ubah role dari JWT dan array roles tujuan menjadi huruf kecil semua
    const userRole = String(user.role || '').toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden. Anda tidak memiliki hak akses.",
      });
    }
    next();
  };
};