import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  try {
    /* -------------------------------------------------------------------------- */
    /*                                 Reset Data                                 */
    /* -------------------------------------------------------------------------- */
    await prisma.stockLog.deleteMany();
    await prisma.salesReport.deleteMany();
    await prisma.stockReport.deleteMany();

    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();

    await prisma.discountReport.deleteMany();
    await prisma.discount.deleteMany();

    await prisma.voucher.deleteMany();

    await prisma.productImage.deleteMany();
    await prisma.stock.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    await prisma.confirmToken.deleteMany();
    await prisma.resetPasswordToken.deleteMany();
    await prisma.address.deleteMany();

    await prisma.store.deleteMany();

    await prisma.user.deleteMany();

    /* -------------------------------------------------------------------------- */
    /*                                  User Seed                                 */
    /* -------------------------------------------------------------------------- */
    const passwordHash = await bcrypt.hash('password123', 10);

    // Buat beberapa user biasa
    await prisma.user.createMany({
      data: [
        {
          name: 'Alice',
          password: passwordHash,
          email: 'alice@example.com',
          emailConfirmed: true,
          referralCode: 'REF123',
          provider: 'EMAIL',
        },
        {
          name: 'Bob',
          password: passwordHash,
          email: 'bob@example.com',
          emailConfirmed: true,
          referralCode: 'REF456',
          provider: 'EMAIL',
        },
        {
          name: 'Charlie',
          password: passwordHash,
          email: 'charlie@example.com',
          emailConfirmed: true,
          referralCode: 'REF789',
          provider: 'EMAIL',
        },
      ],
      skipDuplicates: true,
    });

    // Buat super admin
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: passwordHash,
        role: 'SUPER_ADMIN',
        referralCode: 'SUPERADMIN123',
        provider: 'EMAIL',
      },
    });

    /* -------------------------------------------------------------------------- */
    /*                                 Store Seed                                 */
    /* -------------------------------------------------------------------------- */
    await prisma.store.createMany({
      data: Array.from({ length: 100 }).map((_, index) => ({
        name: `Store ${index + 1}`,
        userId: 1, // Menggunakan user pertama yang dibuat (Alice)
        address: `Address ${index + 1}`,
        latitude: 40.7128 + index * 0.01,
        longitude: -74.006 + index * 0.01,
        maxDistance: 50.0,
      })),
    });

    const storeList = await prisma.store.findMany();
    // console.log('storeList', storeList);

    /* -------------------------------------------------------------------------- */
    /*                                Category Seed                               */
    /* -------------------------------------------------------------------------- */
    await prisma.category.createMany({
      data: Array.from({ length: 10 }).map((_, index) => ({
        name: `Category ${index + 1}`,
      })),
    });

    const categoryList = await prisma.category.findMany();
    // console.log('categoryList', categoryList);

    /* -------------------------------------------------------------------------- */
    /*                                Product Seed                                */
    /* -------------------------------------------------------------------------- */
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

    /* -------------------------------------------------------------------------- */
    /*                                 Stock Seed                                 */
    /* -------------------------------------------------------------------------- */
    const stockList = await Promise.all(
      productList.map((product, index) =>
        prisma.stock.create({
          data: {
            productId: product.id,
            storeId: product.storeId,
            quantity: 100 + index * 10, // Increment quantity
          },
        }),
      ),
    );

    /* -------------------------------------------------------------------------- */
    /*                               Stock Log Seed                               */
    /* -------------------------------------------------------------------------- */
    await Promise.all(
      stockList.map((stock) =>
        prisma.stockLog.createMany({
          data: [
            {
              stockId: stock.id,
              change: -5,
              reason: 'Initial sales',
            },
            {
              stockId: stock.id,
              change: 20,
              reason: 'Restock',
            },
          ],
        }),
      ),
    );

    /* -------------------------------------------------------------------------- */
    /*                                Voucher Seed                                */
    /* -------------------------------------------------------------------------- */
    await prisma.voucher.createMany({
      data: [
        {
          code: 'VOUCHER10',
          type: 'PRODUCT_SPECIFIC',
          value: 10,
          productId: productList[0].id,
          storeId: productList[0].storeId,
        },
        {
          code: 'VOUCHER50K',
          type: 'TOTAL_PURCHASE',
          value: 50000,
          productId: null,
          storeId: productList[1].storeId,
        },
      ],
      skipDuplicates: true,
    });

    /* -------------------------------------------------------------------------- */
    /*                              Product Image Seed                            */
    /* -------------------------------------------------------------------------- */
    await prisma.productImage.createMany({
      data: productList.map((product) => ({
        productId: product.id, // Make sure to match your ProductImage schema’s `productId` type
        imageUrl: `https://images.unsplash.com/photo-1543312872-6800b9d9e30f?q=80&w=2078&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      })),
      skipDuplicates: true,
    });

    /* -------------------------------------------------------------------------- */
    /*                                Discount Seed                               */
    /* -------------------------------------------------------------------------- */
    await prisma.discount.createMany({
      data: [
        {
          productId: productList[0].id,
          storeId: storeList[0].id,
          type: 'PERCENTAGE',
          value: 10,
          minPurchase: 100,
          maxDiscount: 100,
          code: 'DISCOUNT10',
        },
        {
          productId: productList[1].id,
          storeId: storeList[0].id,
          type: 'FIXED_AMOUNT',
          value: 50,
          maxDiscount: 200,
          code: 'BOGO50',
          buyOneGetOne: true,
        },
      ],
      skipDuplicates: true,
    });

    // Fetch the list of users
    const userList = await prisma.user.findMany();

    /* -------------------------------------------------------------------------- */
    /*                                  Cart Seed                                 */
    /* -------------------------------------------------------------------------- */
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

    /* -------------------------------------------------------------------------- */
    /*                                Address Seed                                */
    /* -------------------------------------------------------------------------- */
    const indonesianAddresses = [
      {
        city: 'Jakarta',
        postalCode: 10110,
        latitude: -6.2088,
        longitude: 106.8456,
        streetBase: 'Jalan Thamrin',
      },
      {
        city: 'Bandung',
        postalCode: 40115,
        latitude: -6.9175,
        longitude: 107.6191,
        streetBase: 'Jalan Dago',
      },
      {
        city: 'Surabaya',
        postalCode: 60293,
        latitude: -7.2575,
        longitude: 112.7521,
        streetBase: 'Jalan Tunjungan',
      },
      {
        city: 'Yogyakarta',
        postalCode: 55281,
        latitude: -7.7956,
        longitude: 110.3695,
        streetBase: 'Jalan Malioboro',
      },
      {
        city: 'Denpasar',
        postalCode: 80227,
        latitude: -8.6705,
        longitude: 115.2126,
        streetBase: 'Jalan Teuku Umar',
      },
      {
        city: 'Medan',
        postalCode: 20112,
        latitude: 3.5952,
        longitude: 98.6722,
        streetBase: 'Jalan Gatot Subroto',
      },
      {
        city: 'Semarang',
        postalCode: 50139,
        latitude: -6.9667,
        longitude: 110.4167,
        streetBase: 'Jalan Pandanaran',
      },
      {
        city: 'Makassar',
        postalCode: 90114,
        latitude: -5.1477,
        longitude: 119.4327,
        streetBase: 'Jalan Penghibur',
      },
      {
        city: 'Balikpapan',
        postalCode: 76114,
        latitude: -1.2654,
        longitude: 116.8312,
        streetBase: 'Jalan Jendral Sudirman',
      },
      {
        city: 'Manado',
        postalCode: 95114,
        latitude: 1.4748,
        longitude: 124.8421,
        streetBase: 'Jalan Sam Ratulangi',
      },
    ];

    const addresses = await Promise.all(
      userList.map((user, index) => {
        const addressInfo =
          indonesianAddresses[index % indonesianAddresses.length];

        return prisma.address.create({
          data: {
            userId: user.id,
            street: `${addressInfo.streetBase} No.${100 + index}`,
            city: addressInfo.city,
            postalCode: addressInfo.postalCode,
            isDefault: true,
            latitude: addressInfo.latitude + Math.random() * 0.01, // slight variation
            longitude: addressInfo.longitude + Math.random() * 0.01, // slight variation
          },
        });
      }),
    );

    /* -------------------------------------------------------------------------- */
    /*                                 Order Seed                                 */
    /* -------------------------------------------------------------------------- */
    await Promise.all(
      userList.map((user, index) =>
        prisma.order.create({
          data: {
            userId: user.id,
            storeId: storeList[index % storeList.length].id,
            orderNumber: `ORDER${index + 1}`,
            addressId: addresses[index].id, // Link to the created address
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

    /* -------------------------------------------------------------------------- */
    /*                              OrderItem Seed                                */
    /* -------------------------------------------------------------------------- */
    const orderList = await prisma.order.findMany();
    const cartMap = new Map<number, number>(); // userId -> cartId

    cartList.forEach((cart) => {
      cartMap.set(cart.userId, cart.id);
    });

    await Promise.all(
      orderList.map((order, index) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            cartId: cartMap.get(order.userId)!, // safely mapped from user
            productId: productList[index % productList.length].id,
            quantity: 2,
            price: productList[index % productList.length].price,
          },
        }),
      ),
    );

    /* -------------------------------------------------------------------------- */
    /*                             Confirm Token Seed                             */
    /* -------------------------------------------------------------------------- */
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
    console.info('Seeding successfully completed 🌱');
  } catch (error) {
    console.error(`Seeding error: ${error}`);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// import { PrismaClient, Role, Provider, DiscountType, VoucherType, OrderStatus } from '@prisma/client';
// import { hash } from 'bcrypt';

// const prisma = new PrismaClient();

// async function main() {
//   console.log('Starting seed process...');

//   // Clear existing data to avoid conflicts
//   await prisma.$transaction([
//     prisma.orderItem.deleteMany({}),
//     prisma.order.deleteMany({}),
//     prisma.cartItem.deleteMany({}),
//     prisma.cart.deleteMany({}),
//     prisma.stockLog.deleteMany({}),
//     prisma.stock.deleteMany({}),
//     prisma.discountReport.deleteMany({}),
//     prisma.discount.deleteMany({}),
//     prisma.voucher.deleteMany({}),
//     prisma.salesReport.deleteMany({}),
//     prisma.stockReport.deleteMany({}),
//     prisma.productImage.deleteMany({}),
//     prisma.product.deleteMany({}),
//     prisma.category.deleteMany({}),
//     prisma.store.deleteMany({}),
//     prisma.address.deleteMany({}),
//     prisma.resetPasswordToken.deleteMany({}),
//     prisma.confirmToken.deleteMany({}),
//     prisma.user.deleteMany({}),
//   ]);

//   console.log('Database cleared, creating new seed data...');

//   // Create Users
//   const hashedPassword = await hash('password123', 10);

//   const superAdmin = await prisma.user.create({
//     data: {
//       name: 'Super Admin',
//       email: 'superadmin@freshmarket.com',
//       emailConfirmed: true,
//       password: hashedPassword,
//       role: Role.SUPER_ADMIN,
//       provider: Provider.EMAIL,
//       userPhoto: 'https://randomuser.me/api/portraits/men/1.jpg',
//       referralCode: 'SUPER001',
//     },
//   });

//   const storeAdmin = await prisma.user.create({
//     data: {
//       name: 'Store Admin',
//       email: 'storeadmin@freshmarket.com',
//       emailConfirmed: true,
//       password: hashedPassword,
//       role: Role.STORE_ADMIN,
//       provider: Provider.EMAIL,
//       userPhoto: 'https://randomuser.me/api/portraits/women/2.jpg',
//       referralCode: 'STORE001',
//     },
//   });

//   const customer1 = await prisma.user.create({
//     data: {
//       name: 'John Doe',
//       email: 'john@example.com',
//       emailConfirmed: true,
//       password: hashedPassword,
//       role: Role.CUSTOMER,
//       provider: Provider.EMAIL,
//       userPhoto: 'https://randomuser.me/api/portraits/men/3.jpg',
//       referralCode: 'JOHND001',
//     },
//   });

//   const customer2 = await prisma.user.create({
//     data: {
//       name: 'Jane Smith',
//       email: 'jane@example.com',
//       emailConfirmed: true,
//       password: hashedPassword,
//       role: Role.CUSTOMER,
//       provider: Provider.GOOGLE,
//       userPhoto: 'https://randomuser.me/api/portraits/women/4.jpg',
//       referralCode: 'JANES001',
//     },
//   });

//   console.log('Users created');

//   // Create Address
//   const address1 = await prisma.address.create({
//     data: {
//       userId: customer1.id,
//       street: 'Jl. Merdeka No. 123',
//       city: 'Jakarta',
//       postalCode: 12345,
//       isDefault: true,
//       latitude: -6.175110,
//       longitude: 106.865036,
//     },
//   });

//   const address2 = await prisma.address.create({
//     data: {
//       userId: customer1.id,
//       street: 'Jl. Sudirman No. 456',
//       city: 'Jakarta',
//       postalCode: 12346,
//       isDefault: false,
//       latitude: -6.195110,
//       longitude: 106.875036,
//     },
//   });

//   const address3 = await prisma.address.create({
//     data: {
//       userId: customer2.id,
//       street: 'Jl. Gatot Subroto No. 789',
//       city: 'Jakarta',
//       postalCode: 12347,
//       isDefault: true,
//       latitude: -6.235110,
//       longitude: 106.885036,
//     },
//   });

//   console.log('Addresses created');

//   // Create Stores
//   const store1 = await prisma.store.create({
//     data: {
//       name: 'FreshMarket Central',
//       userId: storeAdmin.id,
//       address: 'Jl. Thamrin No. 10, Jakarta',
//       latitude: -6.195110,
//       longitude: 106.823036,
//       maxDistance: 10.0,
//     },
//   });

//   const store2 = await prisma.store.create({
//     data: {
//       name: 'FreshMarket Express',
//       userId: storeAdmin.id,
//       address: 'Jl. Kuningan No. 25, Jakarta',
//       latitude: -6.235110,
//       longitude: 106.833036,
//       maxDistance: 7.5,
//     },
//   });

//   console.log('Stores created');

//   // Create Categories
//   const vegetableCategory = await prisma.category.create({
//     data: {
//       name: 'Vegetables',
//     },
//   });

//   const fruitCategory = await prisma.category.create({
//     data: {
//       name: 'Fruits',
//     },
//   });

//   const dairyCategory = await prisma.category.create({
//     data: {
//       name: 'Dairy',
//     },
//   });

//   const meatCategory = await prisma.category.create({
//     data: {
//       name: 'Meat & Poultry',
//     },
//   });

//   console.log('Categories created');

//   // Create Carts
//   const cart1 = await prisma.cart.create({
//     data: {
//       userId: customer1.id,
//       totalPrice: 0,
//     },
//   });

//   const cart2 = await prisma.cart.create({
//     data: {
//       userId: customer2.id,
//       totalPrice: 0,
//     },
//   });

//   console.log('Carts created');

//   // Create Cart Items
//   const cartItem1 = await prisma.cartItem.create({
//     data: {
//       cartId: cart1.id,
//       productId: 1, // We'll create this product later
//       quantity: 2,
//     },
//   });

//   const cartItem2 = await prisma.cartItem.create({
//     data: {
//       cartId: cart1.id,
//       productId: 2, // We'll create this product later
//       quantity: 1,
//     },
//   });

//   const cartItem3 = await prisma.cartItem.create({
//     data: {
//       cartId: cart2.id,
//       productId: 3, // We'll create this product later
//       quantity: 3,
//     },
//   });

//   console.log('Cart Items created');

//   // Create Products
//   const tomatoes = await prisma.product.create({
//     data: {
//       name: 'Fresh Tomatoes',
//       description: 'Locally grown fresh tomatoes',
//       price: 15000,
//       categoryId: vegetableCategory.id,
//       storeId: store1.id,
//       cartItemId: cartItem1.id,
//     },
//   });

//   const apples = await prisma.product.create({
//     data: {
//       name: 'Green Apples',
//       description: 'Imported green apples',
//       price: 25000,
//       categoryId: fruitCategory.id,
//       storeId: store1.id,
//       cartItemId: cartItem2.id,
//     },
//   });

//   const milk = await prisma.product.create({
//     data: {
//       name: 'Fresh Milk',
//       description: 'Pasteurized fresh milk',
//       price: 18000,
//       categoryId: dairyCategory.id,
//       storeId: store2.id,
//       cartItemId: cartItem3.id,
//     },
//   });

//   const chicken = await prisma.product.create({
//     data: {
//       name: 'Chicken Breast',
//       description: 'Boneless chicken breast',
//       price: 45000,
//       categoryId: meatCategory.id,
//       storeId: store2.id,
//       cartItemId: cartItem1.id,
//     },
//   });

//   console.log('Products created');

//   // Create Product Images
//   const tomatoImage = await prisma.productImage.create({
//     data: {
//       productId: tomatoes.id.toString(),
//       imageUrl: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469',
//     },
//   });

//   const appleImage = await prisma.productImage.create({
//     data: {
//       productId: apples.id.toString(),
//       imageUrl: 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2',
//     },
//   });

//   const milkImage = await prisma.productImage.create({
//     data: {
//       productId: milk.id.toString(),
//       imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b',
//     },
//   });

//   const chickenImage = await prisma.productImage.create({
//     data: {
//       productId: chicken.id.toString(),
//       imageUrl: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791',
//     },
//   });

//   console.log('Product Images created');

//   // Create Stock
//   const tomatoStock = await prisma.stock.create({
//     data: {
//       productId: tomatoes.id,
//       storeId: store1.id,
//       quantity: 100,
//     },
//   });

//   const appleStock = await prisma.stock.create({
//     data: {
//       productId: apples.id,
//       storeId: store1.id,
//       quantity: 75,
//     },
//   });

//   const milkStock = await prisma.stock.create({
//     data: {
//       productId: milk.id,
//       storeId: store2.id,
//       quantity: 50,
//     },
//   });

//   const chickenStock = await prisma.stock.create({
//     data: {
//       productId: chicken.id,
//       storeId: store2.id,
//       quantity: 30,
//     },
//   });

//   console.log('Stocks created');

//   // Create Stock Logs
//   const tomatoStockLog = await prisma.stockLog.create({
//     data: {
//       stockId: tomatoStock.id,
//       change: 100,
//       reason: 'Initial stock',
//     },
//   });

//   const appleStockLog = await prisma.stockLog.create({
//     data: {
//       stockId: appleStock.id,
//       change: 75,
//       reason: 'Initial stock',
//     },
//   });

//   const milkStockLog = await prisma.stockLog.create({
//     data: {
//       stockId: milkStock.id,
//       change: 50,
//       reason: 'Initial stock',
//     },
//   });

//   const chickenStockLog = await prisma.stockLog.create({
//     data: {
//       stockId: chickenStock.id,
//       change: 30,
//       reason: 'Initial stock',
//     },
//   });

//   console.log('Stock Logs created');

//   // Create Discounts
//   const tomatoDiscount = await prisma.discount.create({
//     data: {
//       productId: tomatoes.id,
//       storeId: store1.id,
//       code: 'TOMATO10',
//       type: DiscountType.PERCENTAGE,
//       value: 10,
//       minPurchase: 20000,
//       buyOneGetOne: false,
//       maxDiscount: 5000,
//     },
//   });

//   const storeDiscount = await prisma.discount.create({
//     data: {
//       storeId: store2.id,
//       code: 'FRESH20',
//       type: DiscountType.PERCENTAGE,
//       value: 20,
//       minPurchase: 100000,
//       buyOneGetOne: false,
//       maxDiscount: 25000,
//     },
//   });

//   console.log('Discounts created');

//   // Create Vouchers
//   const productVoucher = await prisma.voucher.create({
//     data: {
//       code: 'APPLE5K',
//       type: VoucherType.PRODUCT_SPECIFIC,
//       value: 5000,
//       productId: apples.id,
//       storeId: store1.id,
//     },
//   });

//   const shippingVoucher = await prisma.voucher.create({
//     data: {
//       code: 'FREESHIP',
//       type: VoucherType.SHIPPING,
//       value: 10000,
//       storeId: store2.id,
//     },
//   });

//   console.log('Vouchers created');

//   // Create Orders
//   const order1 = await prisma.order.create({
//     data: {
//       userId: customer1.id,
//       storeId: store1.id,
//       addressId: address1.id.toString(),
//       orderNumber: 'ORD-2025-001',
//       orderStatus: OrderStatus.COMPLETED,
//       paymentMethod: 'Midtrans',
//       paymentDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
//       shippingMethod: 'Regular Delivery',
//       shippingCost: 15000,
//       discountTotal: 5000,
//       total: 50000,
//       notes: 'Please call before delivery',
//       shippedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
//       deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
//     },
//   });

//   const order2 = await prisma.order.create({
//     data: {
//       userId: customer2.id,
//       storeId: store2.id,
//       addressId: address3.id.toString(),
//       orderNumber: 'ORD-2025-002',
//       orderStatus: OrderStatus.PENDING_PAYMENT,
//       paymentMethod: 'Manual',
//       paymentDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
//       shippingMethod: 'Express Delivery',
//       shippingCost: 25000,
//       discountTotal: 0,
//       total: 88000,
//       notes: 'Leave at the front door',
//     },
//   });

//   console.log('Orders created');

//   // Create Order Items
//   const orderItem1 = await prisma.orderItem.create({
//     data: {
//       orderId: order1.id,
//       cartId: cart1.id,
//       productId: tomatoes.id,
//       quantity: 2,
//       price: 15000,
//     },
//   });

//   const orderItem2 = await prisma.orderItem.create({
//     data: {
//       orderId: order1.id,
//       cartId: cart1.id,
//       productId: apples.id,
//       quantity: 1,
//       price: 25000,
//     },
//   });

//   const orderItem3 = await prisma.orderItem.create({
//     data: {
//       orderId: order2.id,
//       cartId: cart2.id,
//       productId: milk.id,
//       quantity: 2,
//       price: 18000,
//     },
//   });

//   const orderItem4 = await prisma.orderItem.create({
//     data: {
//       orderId: order2.id,
//       cartId: cart2.id,
//       productId: chicken.id,
//       quantity: 1,
//       price: 45000,
//     },
//   });

//   console.log('Order Items created');

//   // Create Sales Reports
//   const salesReport1 = await prisma.salesReport.create({
//     data: {
//       storeId: store1.id,
//       productId: tomatoes.id,
//       Quantity: 25,
//       total: 375000,
//       month: 3,
//       year: 2025,
//     },
//   });

//   const salesReport2 = await prisma.salesReport.create({
//     data: {
//       storeId: store1.id,
//       productId: apples.id,
//       Quantity: 18,
//       total: 450000,
//       month: 3,
//       year: 2025,
//     },
//   });

//   const salesReport3 = await prisma.salesReport.create({
//     data: {
//       storeId: store2.id,
//       productId: milk.id,
//       Quantity: 32,
//       total: 576000,
//       month: 3,
//       year: 2025,
//     },
//   });

//   console.log('Sales Reports created');

//   // Create Stock Reports
//   const stockReport1 = await prisma.stockReport.create({
//     data: {
//       storeId: store1.id,
//       productId: tomatoes.id,
//       startStock: 100,
//       endStock: 75,
//       totalAdded: 0,
//       totalReduced: 25,
//       month: 3,
//       year: 2025,
//     },
//   });

//   const stockReport2 = await prisma.stockReport.create({
//     data: {
//       storeId: store1.id,
//       productId: apples.id,
//       startStock: 75,
//       endStock: 57,
//       totalAdded: 0,
//       totalReduced: 18,
//       month: 3,
//       year: 2025,
//     },
//   });

//   const stockReport3 = await prisma.stockReport.create({
//     data: {
//       storeId: store2.id,
//       productId: milk.id,
//       startStock: 50,
//       endStock: 68,
//       totalAdded: 50,
//       totalReduced: 32,
//       month: 3,
//       year: 2025,
//     },
//   });

//   console.log('Stock Reports created');

//   // Create Discount Reports
//   const discountReport1 = await prisma.discountReport.create({
//     data: {
//       userId: customer1.id,
//       dicountId: tomatoDiscount.id,
//     },
//   });

//   const discountReport2 = await prisma.discountReport.create({
//     data: {
//       userId: customer2.id,
//       dicountId: storeDiscount.id,
//     },
//   });

//   console.log('Discount Reports created');

//   console.log('Seed data created successfully!');
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
