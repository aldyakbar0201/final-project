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

//create order ini belum ditambahin multer
//jadinya: blm bisa deteksi bukti pembayaran
export async function createOrder(req: Request, res: Response) {
  try {
    const { cartId } = req.body;

    const addCartToOrder = await prisma.order.create({
      data: {
        cartId,
      },
    });

    res.status(201).json({ added: addCartToOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { orderId, status } = req.body;

    const updateStatus = await prisma.order.update({
      where: {
        id: orderId,
        status: true,
      },
      data: {
        status,
      },
    });

    res.status(200).json({ updated: updateStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function deleteOrder(req: Request, res: Response) {
  try {
    const { orderId } = req.body;

    const deleteOrder = await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    res.status(200).json({ deleted: deleteOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}
