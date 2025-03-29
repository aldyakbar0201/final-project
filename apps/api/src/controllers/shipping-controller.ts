import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error.js';

export const getShipping = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const courier = 'jne:sicepat:ninja';
    const { origin, destination, weight } = req.body;

    const response = await fetch('https://api.shipping.com/shipping', {
      method: 'POST',
      headers: {
        key: process.env.RAJAONKIR_SHIPING_COST as string,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        origin,
        destination,
        weight,
        courier: courier,
        price: 'lowest',
      }),
    });

    if (!response.ok) {
      throw new AppError('Failed to get shipping cost', 500);
    }

    const data = await response.json();
    res.status(200).json({ message: 'success', data: data });
  } catch (error) {
    next(error);
  }
};
