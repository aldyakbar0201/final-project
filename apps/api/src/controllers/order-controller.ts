import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import { MidtransClient } from 'midtrans-node-client';
import cloudinary from '../configs/cloudinary.js';
import { v4 as uuid } from 'uuid';

export async function getOrders(_req: Request, res: Response) {
  try {
    const orders = await prisma.order.findMany();
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function createOrderMidtrans(req: Request, res: Response) {
  const { orderId, productId, cartId, productName, price, quantity } = req.body;
  const {
    userId,
    storeId,
    shippingMethod,
    shippingCost,
    total,
    notes,
    orderStatus,
  } = req.body;

  try {
    // Create Snap API instance
    const snap = new MidtransClient.Snap({
      // Set to true if you want Production Environment (accept real transaction).
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      // clientKey: 'MIDTRANS_CLIENT_KEY',
    });

    const id = uuid();
    const parameter = {
      item_details: {
        name: productName,
        price: price,
        quantity: quantity,
      },
      transaction_details: {
        order_id: id,
        gross_amount: price * quantity,
      },
    };

    const transaction = await snap.createTransaction(parameter);

    const addCartToOrderItem = await prisma.orderItem.create({
      data: {
        orderId,
        cartId,
        quantity,
        productId,
        price,
      },
    });

    const addOrderItemToOrder = await prisma.order.create({
      data: {
        id: id,
        userId,
        storeId,
        orderNumber: uuid(),
        addressId: 'TEMP_ADDRESS_ID', // Replace with actual address ID logic
        orderStatus, // Default status for manual orders
        paymentMethod: 'MIDTRANS', // Payment method for manual transactions
        paymentProof: transaction.redirect_url, // Save the file URL
        paymentProofTime: new Date(),
        paymentDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Example: 7 days from now
        shippingMethod,
        shippingCost,
        total,
        notes,
      },
    });

    res
      .status(201)
      .json({ added: addOrderItemToOrder, transaction, addCartToOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function createOrderManual(req: Request, res: Response) {
  const { orderId, cartId, productId, price, quantity } = req.body;
  const {
    userId,
    storeId,
    shippingMethod,
    shippingCost,
    total,
    notes,
    orderStatus,
  } = req.body;
  // const paymentProof = req.file

  let uploadResult;
  if (req.file) {
    uploadResult = await cloudinary.uploader
      .upload(req.file.path, { folder: 'payment-proof', resource_type: 'raw' })
      .catch((error) => {
        console.log(error);
      });
  } else {
    return res.status(400).json({ error: 'File is required' });
  }

  try {
    const addCartToOrderItem = await prisma.orderItem.create({
      data: {
        orderId,
        cartId,
        quantity,
        productId,
        price,
      },
    });

    const addOrderItemToOrder = await prisma.order.create({
      data: {
        userId,
        storeId,
        orderNumber: uuid(),
        addressId: 'TEMP_ADDRESS_ID', // Replace with actual address ID logic
        orderStatus, // Default status for manual orders
        paymentMethod: 'MANUAL', // Payment method for manual transactions
        paymentProof: uploadResult?.secure_url, // Save the file URL
        paymentProofTime: new Date(),
        paymentDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Example: 7 days from now
        shippingMethod,
        shippingCost,
        total,
        notes,
      },
    });

    res.status(201).json({ added: addOrderItemToOrder, addCartToOrderItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { orderId, orderStatus } = req.body;

    const updateStatus = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus,
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
