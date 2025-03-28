import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

export const createVoucher = async (req: Request, res: Response) => {
  const { code, type, value } = req.body;

  try {
    const voucher = await prisma.voucher.create({
      data: {
        code,
        type,
        value,
      },
    });

    res.status(201).json({ created: voucher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
};

// Apply voucher to a product
// export const applyVoucher = async (req: Request, res: Response) => {
//   const { voucherCode, productId } = req.body;

//   try {
//     // Find the voucher
//     const voucher = await prisma.voucher.findUnique({
//       where: { code: voucherCode },
//     });

//     if (!voucher) {
//       return res.status(404).json({ message: 'Voucher not found' });
//     }

//     // Check if the voucher can be used on the product
//     if (voucher.productId !== productId) {
//       return res
//         .status(400)
//         .json({ message: 'Voucher cannot be used on this product' });
//     }

//     // Find the product
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Apply the voucher discount
//     const discountedPrice = product.price - voucher.discount;

//     // Update the product price
//     const updatedProduct = await prisma.product.update({
//       where: { id: productId },
//       data: { price: discountedPrice },
//     });

//     res
//       .status(200)
//       .json({
//         message: 'Voucher applied successfully',
//         product: updatedProduct,
//       });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error', error });
//   }
// };
