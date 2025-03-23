import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.discountReport.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();
  await prisma.confirmToken.deleteMany();
  await prisma.address.deleteMany();

  // Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.createMany({
    data: [
      {
        name: 'Alice',
        email: 'alice@example.com',
        password: passwordHash,
        emailConfirmed: true,
        referralCode: 'REF123',
        provider: 'EMAIL',
      },
      {
        name: 'Bob',
        email: 'bob@example.com',
        password: passwordHash,
        emailConfirmed: true,
        referralCode: 'REF456',
        provider: 'EMAIL',
      },
      {
        name: 'Charlie',
        email: 'charlie@example.com',
        password: passwordHash,
        emailConfirmed: true,
        referralCode: 'REF789',
        provider: 'EMAIL',
      },
    ],
    skipDuplicates: true,
  });

  const userList = await prisma.user.findMany();

  // Create Addresses
  await Promise.all(
    userList.map((user, index) =>
      prisma.address.create({
        data: {
          userId: user.id,
          street: `Street ${index + 1}`,
          city: `City ${index + 1}`,
          postalCode: 12345 + index,
          isDefault: index === 0, // Set the first address as default
          latitude: -6.2 + index * 0.01,
          longitude: 106.816666 + index * 0.01,
        },
      }),
    ),
  );

  // Create Stores
  await prisma.store.createMany({
    data: [
      {
        name: 'Tech Store',
        userId: userList[0].id,
        address: '123 Tech Lane',
        latitude: -6.2,
        longitude: 106.816666,
        maxDistance: 10,
      },
      {
        name: 'Grocery Store',
        userId: userList[1].id,
        address: '456 Grocery Ave',
        latitude: -6.21,
        longitude: 106.826666,
        maxDistance: 15,
      },
    ],
    skipDuplicates: true,
  });

  const storeList = await prisma.store.findMany();

  // Create Categories
  await prisma.category.createMany({
    data: [
      { name: 'Electronics' },
      { name: 'Groceries' },
      { name: 'Clothing' },
    ],
    skipDuplicates: true,
  });

  const categoryList = await prisma.category.findMany();

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: 'Laptop',
        description: 'High performance laptop',
        price: 1500.0,
        categoryId: categoryList[0].id,
        storeId: storeList[0].id,
      },
      {
        name: 'Smartphone',
        description: 'Latest model smartphone',
        price: 800.0,
        categoryId: categoryList[0].id,
        storeId: storeList[0].id,
      },
      {
        name: 'Apple',
        description: 'Fresh apples',
        price: 2.0,
        categoryId: categoryList[1].id,
        storeId: storeList[1].id,
      },
    ],
    skipDuplicates: true,
  });

  const productList = await prisma.product.findMany();

  // Create Discounts
  await prisma.discount.createMany({
    data: [
      {
        productId: productList[0].id,
        storeId: storeList[0].id,
        type: 'PERCENTAGE',
        value: 10,
        minPurchase: 100,
        buyOneGetOne: false,
        maxDiscount: 100,
      },
      {
        productId: productList[1].id,
        storeId: storeList[0].id,
        type: 'FIXED_AMOUNT',
        value: 50,
        minPurchase: 200,
        buyOneGetOne: true,
        maxDiscount: 200,
      },
    ],
    skipDuplicates: true,
  });

  // Create Carts
  await Promise.all(
    userList.map((user) =>
      prisma.cart.create({
        data: {
          userId: user.id,
          totalPrice: 0,
        },
      }),
    ),
  );

  const cartList = await prisma.cart.findMany();

  // Create CartItems
  await Promise.all(
    cartList.map((cart, index) =>
      prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productList[index % productList.length].id,
          quantity: 2,
        },
      }),
    ),
  );

  // Create Orders
  await Promise.all(
    userList.map((user, index) =>
      prisma.order.create({
        data: {
          userId: user.id,
          storeId: storeList[index % storeList.length].id,
          orderNumber: `ORDER${index + 1}`,
          addressId: String(addresses[index].id), // Link to the created address
          orderStatus: 'PENDING_PAYMENT',
          paymentMethod: 'BANK_TRANSFER',
          paymentDueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
          shippingMethod: 'Standard',
          shippingCost: 5.0,
          total: 100.0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }),
    ),
  );

  // Create ConfirmTokens
  await Promise.all(
    userList.map((user) =>
      prisma.confirmToken.create({
        data: {
          token: crypto.randomBytes(20).toString('hex'),
          expiredDate: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day expiration
          userId: user.id,
        },
      }),
    ),
  );

  console.log('Seed data successfully inserted');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
