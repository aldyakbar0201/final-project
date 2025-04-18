import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/express.js';
import { Role } from '@prisma/client';

export async function VerifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }
    const verifiedUser = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as CustomJwtPayload;
    req.user = verifiedUser;

    next();
  } catch (error) {
    next(error);
  }
}

// Middleware untuk memeriksa apakah user adalah Super Admin atau Store Admin
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userRole = req.user?.role; // Ambil role dari request object

  if (
    !userRole ||
    (userRole !== Role.SUPER_ADMIN && userRole !== Role.STORE_ADMIN)
  ) {
    res.status(403).json({ message: 'Forbidden: User is not authorized' });
    return; // Hentikan eksekusi fungsi
  }

  next(); // Lanjutkan ke middleware atau handler berikutnya
}

// Middleware untuk memeriksa apakah user adalah Super Admin
export function superAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userRole = req.user?.role; // Ambil role dari request object

  if (!userRole || userRole !== Role.SUPER_ADMIN) {
    res.status(403).json({ message: 'Forbidden: User is not a super admin' });
    return; // Hentikan eksekusi fungsi
  }

  next(); // Lanjutkan ke middleware atau handler berikutnya
}
