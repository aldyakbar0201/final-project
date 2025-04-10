import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { geocodeAddress } from '../utils/geocoding.js';

const prisma = new PrismaClient();

export async function addAddress(
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
    const { street, city, postalCode, isDefault } = req.body;

    if (!street || !city || !postalCode) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    // Generate latitude and longitude from address
    const { latitude, longitude } = await geocodeAddress(
      street,
      city,
      Number(postalCode),
    );

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId,
        street,
        city,
        postalCode: Number(postalCode),
        isDefault: isDefault || false,
        latitude,
        longitude,
      },
    });

    res.status(201).json({
      ok: true,
      message: 'Address added successfully',
      data: newAddress,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserAddresses(
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

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });

    res.status(200).json({
      ok: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAddressById(
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

    const addressId = Number.parseInt(req.params.id);
    if (isNaN(addressId)) {
      res.status(400).json({ message: 'Invalid address ID' });
      return;
    }

    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!address) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    res.status(200).json({
      ok: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAddress(
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

    const addressId = Number.parseInt(req.params.id);
    if (isNaN(addressId)) {
      res.status(400).json({ message: 'Invalid address ID' });
      return;
    }

    const { street, city, postalCode, isDefault } = req.body;

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    // Generate new coordinates if address components changed
    let latitude = existingAddress.latitude;
    let longitude = existingAddress.longitude;

    if (
      (street && street !== existingAddress.street) ||
      (city && city !== existingAddress.city) ||
      (postalCode && Number(postalCode) !== existingAddress.postalCode)
    ) {
      const coordinates = await geocodeAddress(
        street || existingAddress.street,
        city || existingAddress.city,
        Number(postalCode) || existingAddress.postalCode,
      );
      latitude = coordinates.latitude;
      longitude = coordinates.longitude;
    }

    // If setting as default, update all other addresses to non-default
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          id: { not: addressId },
        },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        street: street || existingAddress.street,
        city: city || existingAddress.city,
        postalCode:
          postalCode !== undefined
            ? Number(postalCode)
            : existingAddress.postalCode,
        isDefault:
          isDefault !== undefined ? isDefault : existingAddress.isDefault,
        latitude,
        longitude,
      },
    });

    res.status(200).json({
      ok: true,
      message: 'Address updated successfully',
      data: updatedAddress,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAddress(
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

    const addressId = Number.parseInt(req.params.id);
    if (isNaN(addressId)) {
      res.status(400).json({ message: 'Invalid address ID' });
      return;
    }

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    // Delete the address
    await prisma.address.delete({
      where: { id: addressId },
    });

    // If the deleted address was the default, set another address as default if available
    if (existingAddress.isDefault) {
      const anotherAddress = await prisma.address.findFirst({
        where: { userId },
      });

      if (anotherAddress) {
        await prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isDefault: true },
        });
      }
    }

    res.status(200).json({
      ok: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function setDefaultAddress(
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

    const addressId = Number.parseInt(req.params.id);
    if (isNaN(addressId)) {
      res.status(400).json({ message: 'Invalid address ID' });
      return;
    }

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    });

    if (!existingAddress) {
      res.status(404).json({ message: 'Address not found' });
      return;
    }

    // Update all addresses to non-default
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set the specified address as default
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    res.status(200).json({
      ok: true,
      message: 'Default address set successfully',
      data: updatedAddress,
    });
  } catch (error) {
    next(error);
  }
}
