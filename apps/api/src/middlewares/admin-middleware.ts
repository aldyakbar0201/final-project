import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/express.js';
import { Role } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user?: CustomJwtPayload | null;
}

export function VerifyToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  try {
    console.log('Cookies in request:', req.cookies);

    const token = req.cookies?.token;
    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return; // Hentikan eksekusi agar tidak lanjut ke `next()`
    }

    // Verifikasi token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as CustomJwtPayload;

    req.user = decoded ?? null;
    next(); // Pastikan selalu memanggil next()
  } catch (err) {
    console.error('JWT Verification Error:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
    return; // Hentikan eksekusi agar tidak lanjut ke `next()`
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
