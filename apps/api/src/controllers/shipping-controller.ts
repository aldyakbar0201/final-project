import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app.error.js';
import { prisma } from '../configs/prisma.js';

export async function getShippingOptions(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const courier =
      'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse';
    const origin = req.query.origin as string;
    const weight = req.query.weight as string;

    // untuk cari userid
    const id = req.user?.id;
    const prismaUserId = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        Address: {
          select: {
            postalCode: true,
          },
        },
      },
    });
    const destination = String(prismaUserId?.Address[0].postalCode);

    if (!prismaUserId?.Address.length) {
      throw new AppError('No address found for user', 404);
    }

    if (!origin || !destination || !weight) {
      throw new AppError('Missing required parameters', 400);
    }

    const response = await fetch(
      'https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost',
      {
        method: 'POST',
        headers: {
          key: process.env.RAJAONKIR_SHIPING_COST as string,
        },
        body: new URLSearchParams({
          origin,
          destination,
          weight,
          courier,
          price: 'lowest',
        }),
      },
    );

    if (!response.ok) {
      throw new AppError('Failed to fetch shipping cost', 500);
    }

    const data = await response.json();
    res.status(200).json({ data });
  } catch (error) {
    next(error);
    console.error('Error fetching shipping options:', error);
  }
}
