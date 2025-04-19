import { NextFunction, Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import cloudinary from '../configs/cloudinary.js';
import fs from 'fs/promises';

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

    const cloudinaryData = await cloudinary.uploader.upload(req.file.path, {
      folder: 'frshbasket/images',
    });
    fs.unlink(req.file.path);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        userPhoto: cloudinaryData.secure_url, // Save the path of the uploaded file
      },
    });

    res.status(200).json({ message: 'User image uploaded successfully', user });
  } catch (error) {
    next(error);
  }
}
