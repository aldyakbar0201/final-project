import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';
import { MidtransClient } from 'midtrans-node-client';
import cloudinary from '../configs/cloudinary.js';
import { v4 as uuid } from 'uuid';

/* -------------------------------------------------------------------------- */
/*                                FOR CUSTOMER                                */
/* -------------------------------------------------------------------------- */
export async function getOrders(req: Request, res: Response) {
  try {
    const userId = req.user?.id || 5;

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        OrderItems: {
          include: {
            Product: {
              select: {
                name: true,
                price: true,
                ProductImage: {
                  select: {
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
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
    addressId,
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
        userId,
        storeId,
        addressId,
        orderNumber: uuid(),
        orderStatus, // Default status for manual orders
        paymentMethod: 'Midtrans', // Payment method for manual transactions
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

export async function createOrderManual(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Destructure request body
    const { orderId, cartId, productId, price, quantity } = req.body;
    const {
      userId,
      storeId,
      addressId,
      shippingMethod,
      shippingCost,
      total,
      notes,
      orderStatus,
    } = req.body;
    // const { file } = req;

    // Validate required fields
    if (
      !orderId ||
      !cartId ||
      !productId ||
      !price ||
      !quantity ||
      !userId ||
      !storeId ||
      !total
    ) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Check if a file was uploaded
    if (!req.file) {
      res.status(400).json({ error: 'File is required' });
      return;
    }

    // Upload the file to Cloudinary
    let uploadResult;
    try {
      uploadResult = await cloudinary.uploader.upload(
        req.file.buffer
          ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
          : req.file.path,
        { folder: 'payment-proof', resource_type: 'auto' },
      );
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      res.status(500).json({ error: 'Failed to upload file to Cloudinary' });
      return;
    }

    // Add the cart item to the order
    const addCartToOrderItem = await prisma.orderItem.create({
      data: {
        orderId,
        cartId,
        quantity,
        productId,
        price,
      },
    });

    // Create the order in the database
    const addOrderItemToOrder = await prisma.order.create({
      data: {
        userId,
        storeId,
        addressId,
        orderNumber: uuid(),
        orderStatus: orderStatus || 'PENDING', // Default status for manual orders
        paymentMethod: 'Manual', // Payment method for manual transactions
        paymentProof: uploadResult.secure_url, // Save the file URL
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
    console.error('Error in createOrderManual:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const { orderId, orderStatus } = req.body;

    if (!orderId || !orderStatus) {
      res.status(400).json({ error: 'orderId and orderStatus are required' });
      return;
    }

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

/* -------------------------------------------------------------------------- */
/*                                  FOR ADMIN                                 */
/* -------------------------------------------------------------------------- */

export async function validatePayment(req: Request, res: Response) {
  try {
    const { orderId, orderStatus } = req.body;

    const updatePaymentStatus = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus,
      },
    });

    res.status(200).json({ updated: updatePaymentStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}
