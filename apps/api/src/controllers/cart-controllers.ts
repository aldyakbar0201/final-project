import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

// export async function getCartItems(_req: Request, res: Response) {
//   try {
//     const cartItems = await prisma.cart.findMany({
//       include: {
//         CartItem: {
//           include: {
//             Product: {
//               include: { ProductImage: true },
//             },
//           },
//         },
//       },
//     });

//     res.status(200).json(cartItems);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'problem in internal server' });
//   }
// }

export async function getCurrentUserCart(req: Request, res: Response) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID not found in token' });
      return;
    }

    const cartItems = await prisma.cart.findUnique({
      where: { userId },
      include: {
        CartItem: {
          include: {
            Product: {
              include: {
                ProductImage: { select: { imageUrl: true } },
                Store: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function getCartItemById(req: Request, res: Response) {
  try {
    const { cartItemId } = req.params;
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: Number(cartItemId) },
      include: {
        Product: true,
      },
    });

    if (!cartItem) {
      res.status(404).json({ error: 'cart item not found' });
      return;
    }

    res.status(200).json(cartItem);
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

export async function getCartQuantity(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const id = req.user?.id || 10;

    if (!id) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    // Find the cart for the user
    const cart = await prisma.cart.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        CartItem: true,
      },
    });

    if (!cart) {
      res.status(200).json({ totalQuantity: 0 });
      return;
    }

    // Calculate total quantity
    const totalQuantity = cart.CartItem.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    res.status(200).json({ totalQuantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Problem in internal server' });
  }
}

// export async function goToCheckout(req: Request, res: Response): Promise<void> {
//   try {
//     const { cartId } = req.body
//     const courier =
//     'jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse';
//     const origin = req.query.origin as string;
//     const destination = req.query.destination as string;
//     const weight = req.query.weight as string;

//     const response = await fetch(
//       'https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost',
//       {
//         method: 'POST',
//         headers: {
//           key: process.env.RAJAONKIR_SHIPING_COST as string,
//         },
//         body: new URLSearchParams({
//           origin,
//           destination,
//           weight,
//           courier,
//           price: 'lowest',
//         }),
//       },
//     );
//     const data = await response.json()

//     // look for cart
//     const cart = await prisma.cart.findUnique({
//       where: { id: cartId },
//       include: { CartItem: true }
//     })

//     if (!cart || cart.CartItem.length === 0) {
//       res.status(400).json({ error: 'Cart is empty or not found' })
//       return
//     }

//     // const totalQuantity = cart.CartItem.reduce((total, item) => {
//     //   return total + item.quantity;
//     // }, 0);

//     const order = await prisma.order.create({
//       data: {
//         userId: cart.userId,
//         storeId: 1, // Example: Replace with actual logic
//         addressId: 1, // Example: Replace with actual logic
//         orderNumber: `ORD-${Date.now()}`, // You can generate this however you'd like
//         orderStatus: 'PENDING_PAYMENT', // Replace with your default enum
//         paymentMethod: 'Midtrans', // Default or dynamic
//         paymentDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
//         shippingMethod: data.data[0].name,
//         shippingCost: Number(data.data[0].cost), // Example shipping cost
//         total: cart.totalPrice,
//         OrderItems: {
//           create: cart.CartItem.map(item => ({
//             cartId: cart.id,
//             productId: item.productId,
//             quantity: item.quantity,
//             price: cart.totalPrice
//           }))
//         }
//       }
//     })

//     // const order = await prisma.orderItem.create({
//     //   data: {
//     //     orderId: uuid(),
//     //     cartId: cart.userId,
//     //     productId,
//     //     quantity: totalQuantity,
//     //     price: cart.totalPrice
//     //   }
//     // })

//     await prisma.cartItem.deleteMany({
//       where: { cartId }
//     })

//     res.status(200).json({ message: 'Checkout successful', orderId: order })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ error: 'Problem in internal server' })
//   }
// }
