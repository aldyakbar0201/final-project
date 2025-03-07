// import { Request, Response } from 'express';
// import { prisma } from '../configs/prisma.js';

// export async function getCartItems(_req: Request, res: Response) {
//   try {
//     const cartItems = await prisma.cart.findMany({
//       include: { product: true },
//     });

//     res.status(200).json(cartItems);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'problem in internal server' });
//   }
// }

// export async function addToCart(req: Request, res: Response) {
//   try {
//     const { productId, total } = req.body

//   } catch (error) {
//     console.error(error)
//     res.status(500).json({error: "problem in internal server"})
//   }
// }
