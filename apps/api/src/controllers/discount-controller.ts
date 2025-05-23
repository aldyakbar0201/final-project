import { Request, Response } from 'express';
import { prisma } from '../configs/prisma.js';

export async function createDiscount(req: Request, res: Response) {
  const { code, type, value, maxDiscount } = req.body;

  try {
    const discount = await prisma.discount.create({
      data: {
        code,
        type,
        value,
        maxDiscount,
      },
    });

    res.status(201).json({ created: discount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
}

export async function getDiscounts(_req: Request, res: Response) {
  try {
    const discounts = await prisma.discount.findMany();
    res.status(200).json({ discounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

// export async function applyDiscount(req: Request, res: Response) {
//   const { code, productId } = req.body;

//   try {
//     // Find the discount
//     const discount = await prisma.discount.findFirst({
//       where: { code: code },
//     });

//     if (!discount) {
//       return res.status(404).json({ message: 'Discount not found' });
//     }

//     // Check if the discount can be used on the product
//     if (discount.productId !== productId) {
//       return res
//         .status(400)
//         .json({ message: 'Discount cannot be used on this product' });
//     }

//     // Find the product
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Calculate the discounted price
//     let discountedPrice = product.price - discount.value;

//     // Apply max discount limit
//     if (discount.maxDiscount && discountedPrice > Number(discount.maxDiscount)) {
//       discountedPrice as number = discount.maxDiscount;
//     }

//     res.status(200).json({ discountedPrice });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'problem in internal server' });
//   }
// }

export async function deleteDiscount(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const discount = await prisma.discount.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ deleted: discount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function buyOneGetOne(req: Request, res: Response) {
  const { productId, quantity } = req.body;

  try {
    // Find the discount
    const discount = await prisma.discount.findFirst({
      where: { productId: Number(productId), buyOneGetOne: true },
    });

    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    const freeOneItem = quantity + 1;

    res.status(200).json({ freeOneItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}

export async function percentageDiscount(req: Request, res: Response) {
  const { productId, quantity } = req.body;

  try {
    // Find the discount
    const discount = await prisma.discount.findFirst({
      where: { productId: Number(productId), type: 'PERCENTAGE' },
    });

    if (!discount) {
      return res.status(404).json({ message: 'Discount not found' });
    }

    // Calculate the total price
    let totalPrice = 0;
    if (quantity > 1) {
      totalPrice = (quantity - Math.floor(quantity / 2)) * discount.value;
    } else {
      totalPrice = quantity * discount.value;
    }

    res.status(200).json({ totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'problem in internal server' });
  }
}
