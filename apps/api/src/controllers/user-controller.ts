import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import { AppError } from '../errors/app.error.js';

export async function lookup(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email: email } });

    if (!user) {
      throw new AppError('Not Found: User not found', 404);
    }
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function uploadUserImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        userPhoto: req.file.path, // Save the path of the uploaded file
      },
    });

    res.status(200).json({ message: 'User image uploaded successfully', user });
  } catch (error) {
    next(error);
  }
}
