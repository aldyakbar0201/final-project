import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';

export async function getRole(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const roles = Object.values(Role).filter((item) => item !== 'SUPER_ADMIN');
    res.status(200).json({ ok: true, data: roles });
  } catch (error) {
    next(error);
  }
}
