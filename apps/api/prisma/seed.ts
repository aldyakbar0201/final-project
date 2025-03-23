// import bcrypt from 'bcryptjs';

// import { prisma } from '../src/configs/prisma.js';

// const { genSalt, hash } = bcrypt;

// async function main() {
//   try {
//     /* -------------------------------------------------------------------------- */
//     /*                                 Reset Data                                 */
//     /* -------------------------------------------------------------------------- */
//     await prisma.user.deleteMany();

//     /* -------------------------------------------------------------------------- */
//     /*                                  User Seed                                 */
//     /* -------------------------------------------------------------------------- */
//     const salt = await genSalt(10);
//     const hashedPassword = await hash('newpass', salt);

//     await prisma.user.create({
//       data: {
//         name: 'John Doe',
//         email: 'john.doe@mail.com',
//         password: hashedPassword,
//         // //profileImage:
//         //   "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       },
//     });

//     await prisma.user.create({
//       data: {
//         name: 'Jane Smith',
//         email: 'jane.smith@mail.com',
//         password: hashedPassword,
//         // profileImage:
//         //   "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       },
//     });

//     console.info(`Seeding successfully 🌱`);
//   } catch (error) {
//     console.error(`Seeding error: ${error}`);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();
  await prisma.store.deleteMany();
  await prisma.category.deleteMany();
  await prisma.product.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();

  // Create a User
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedpassword', // Replace with a properly hashed password
      referralCode: uuidv4(),
    },
  });

  // Create a Store
  const store = await prisma.store.create({
    data: {
      name: 'Sample Store',
      userId: user.id,
      address: '123 Main Street',
      latitude: -6.2088,
      longitude: 106.8456,
      maxDistance: 50.0,
    },
  });

  // Create a Category
  const category = await prisma.category.create({
    data: {
      name: 'Sample Category',
    },
  });

  // Create a Product
  const product = await prisma.product.create({
    data: {
      name: 'Sample Product',
      description: 'A sample product description',
      price: 100000,
      categoryId: category.id, // Use dynamically created category id
      storeId: store.id,
    },
  });

  // Create a Cart
  const cart = await prisma.cart.create({
    data: {
      userId: user.id,
      totalPrice: product.price,
    },
  });

  // Create a CartItem
  const cartItem = await prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId: product.id,
      quantity: 2,
    },
  });

  // Create an Order
  const order = await prisma.order.create({
    data: {
      id: uuidv4(),
      userId: user.id,
      storeId: store.id,
      orderNumber: uuidv4(),
      addressId: 'TEMP_ADDRESS_ID',
      orderStatus: 'PENDING_PAYMENT',
      paymentMethod: 'MIDTRANS',
      paymentProof: 'https://midtrans.com/payment-proof',
      paymentProofTime: new Date(),
      paymentDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      shippingMethod: 'JNE',
      shippingCost: 15000,
      total: product.price * cartItem.quantity + 15000,
      notes: 'Please deliver before noon.',
    },
  });

  // Create an OrderItem
  await prisma.orderItem.create({
    data: {
      orderId: order.id,
      cartId: cart.id, // Ensure cartId is correctly referenced
      productId: product.id,
      quantity: cartItem.quantity,
      price: product.price,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
