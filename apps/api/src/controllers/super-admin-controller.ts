import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all stores
export async function getAllStores(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const stores = await prisma.store.findMany();
    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
}

// Create new store
export async function createStore(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const {
      name,
      address,
      postalCode,
      latitude,
      longitude,
      maxDistance,
      userId,
    } = req.body;

    if (
      !name ||
      !address ||
      latitude === undefined ||
      longitude === undefined ||
      maxDistance === undefined ||
      userId === undefined ||
      address === undefined ||
      postalCode === undefined
    ) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const newStore = await prisma.store.create({
      data: {
        name,
        address,
        postalCode,
        latitude,
        longitude,
        maxDistance,
        userId: Number(userId),
      },
    });

    res
      .status(201)
      .json({ message: 'Store created successfully', store: newStore });
  } catch (error) {
    next(error);
  }
}

// Update store
export async function updateStore(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const storeId = Number(req.params.id);
    const { name, address, latitude, longitude, maxDistance } = req.body;

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        name,
        address,
        latitude,
        longitude,
        maxDistance,
      },
    });

    res
      .status(200)
      .json({ message: 'Store updated successfully', store: updatedStore });
  } catch (error) {
    next(error);
  }
}

// Delete store
export async function deleteStore(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const storeId = Number(req.params.id);

    await prisma.store.delete({
      where: { id: storeId },
    });

    res.status(200).json({ message: 'Store deleted successfully' });
  } catch (error) {
    next(error);
  }
}

// Assign admin user to store
export async function assignStoreAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { storeId, userId } = req.body;

    if (!storeId || !userId) {
      res.status(400).json({ message: 'Missing storeId or userId' });
      return;
    }

    const updatedStore = await prisma.store.update({
      where: { id: Number(storeId) },
      data: {
        userId,
      },
    });

    res.status(200).json({
      message: 'Store admin assigned successfully',
      store: updatedStore,
    });
  } catch (error) {
    next(error);
  }
}
