import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

export async function getCartItems(_req: Request, res: Response) {
  try {
    const cartItems = await prisma.cart.findMany({
      include: {
        CartItem: true,
      },
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function addToCart(req: Request, res: Response) {
  try {
    const { cartId, productId, quantity } = req.body;
    const { totalPrice, userId } = req.body;

    //check the existence of the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({ error: 'product not found' });
      return;
    }

    //check the avilability of the product
    const avilability = await prisma.stock.findFirst({
      where: { productId: productId, quantity: { gte: quantity } },
    });

    if (!avilability) {
      res.status(400).json({ error: 'product is out of stock' });
      return;
    }

    //add to cartItem
    const addedProduct = await prisma.cartItem.create({
      data: {
        productId,
        quantity,
        cartId,
      },
    });

    // add to cart
    const addItemToCart = await prisma.cart.create({
      data: {
        totalPrice,
        userId,
        // items: {
        //   connect: { id: addedProduct.id }, // Connecting cartItem to cart
      },
    });
    // const addItemToCart = await prisma.cart.create({
    //   data: {
    //     items: {
    //       connect: { id: addedProduct.id }, // Connecting cartItem to cart
    //     },
    //   },
    // });

    res.status(200).json({ added: addedProduct, addItemToCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function removeFromCart(req: Request, res: Response) {
  try {
    const { cartItemId } = req.body;

    const removal = await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    res.status(200).json({ message: 'removal success', removed: removal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function updateCartItem(req: Request, res: Response) {
  try {
    const { cartItemId, quantity } = req.body;

    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        quantity: quantity,
      },
    });

    res.status(200).json({ updated: updatedCartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}
