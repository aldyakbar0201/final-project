import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

export async function getOrders(_req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}
