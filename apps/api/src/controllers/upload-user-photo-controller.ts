import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

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
