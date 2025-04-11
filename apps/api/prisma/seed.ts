import {
  PrismaClient,
  DiscountType,
  OrderStatus,
  Category,
  Store,
  Product,
  User,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Clean up existing data (optional)
  await cleanDatabase();

  // Create categories
  console.log('Creating categories...');
  const categories = await createCategories();

  // Create users
  console.log('Creating users...');
  const users = await createUsers();

  // Create stores
  console.log('Creating stores...');
  const stores = await createStores();

  // Create products
  console.log('Creating products...');
  const products = await createProducts(categories, stores);

  // Create stock for products
  console.log('Creating stock for products...');
  await createStock(products);

  // Create discounts
  console.log('Creating discounts...');
  await createDiscounts(products);

  // Create carts for users
  console.log('Creating carts for users...');
  await createCarts(users, products);

  // Create orders
  console.log('Creating orders...');
  await createOrders(users, products, stores);

  console.log('Seeding completed successfully!');
}

async function cleanDatabase() {
  // Delete all existing data in reverse order of dependencies
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.discountReport.deleteMany({});
  await prisma.discount.deleteMany({});
  await prisma.stockLog.deleteMany({});
  await prisma.stock.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.resetPasswordToken.deleteMany({});
  await prisma.confirmToken.deleteMany({});
  await prisma.user.deleteMany({});
}

async function createUsers(): Promise<User[]> {
  console.log('Creating users...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // Create regular users
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

  // Create super admin
  await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: passwordHash,
      role: 'SUPER_ADMIN',
      referralCode: 'SUPERADMIN123',
    },
  });

  // Fetch all users to return
  return await prisma.user.findMany();
}

async function createCategories(): Promise<Category[]> {
  const categories = [
    { name: 'Fruits & Vegetables' },
    { name: 'Dairy & Eggs' },
    { name: 'Meat & Seafood' },
    { name: 'Bakery' },
    { name: 'Beverages' },
    { name: 'Snacks' },
    { name: 'Canned Goods' },
    { name: 'Frozen Foods' },
    { name: 'Household' },
  ];

  const createdCategories: Category[] = [];
  for (const category of categories) {
    const createdCategory = await prisma.category.create({
      data: category,
    });
    createdCategories.push(createdCategory);
  }
  return createdCategories;
}

async function createStores(): Promise<Store[]> {
  const stores = [
    {
      name: 'Fresh Market',
      userId: 1,
      address: '123 Main Street, City Center',
      latitude: -6.2088,
      longitude: 106.8456,
      maxDistance: 10.0,
    },
    {
      name: 'Organic Grocers',
      userId: 2,
      address: '456 Oak Avenue, Suburb Area',
      latitude: -6.2254,
      longitude: 106.8023,
      maxDistance: 15.0,
    },
    {
      name: 'Value Supermarket',
      userId: 3,
      address: '789 Pine Road, Downtown',
      latitude: -6.1751,
      longitude: 106.865,
      maxDistance: 20.0,
    },
  ];

  const createdStores: Store[] = [];
  for (const store of stores) {
    const createdStore = await prisma.store.create({
      data: store,
    });
    createdStores.push(createdStore);
  }
  return createdStores;
}

async function createProducts(
  categories: Category[],
  stores: Store[],
): Promise<Product[]> {
  const products = [
    {
      name: 'Fresh Apples',
      description:
        'Crisp and juicy red apples, perfect for snacking or baking.',
      price: 15000, // IDR price
      categoryId: categories[0].id, // Fruits & Vegetables
      storeId: stores[0].id, // Fresh Market
      ProductImage: {
        create: {
          productId: '1',
          imageUrl: 'https://example.com/images/apples.jpg',
        },
      },
    },
    {
      name: 'Organic Milk',
      description: 'Fresh organic whole milk from grass-fed cows.',
      price: 25000, // IDR price
      categoryId: categories[1].id, // Dairy & Eggs
      storeId: stores[1].id, // Organic Grocers
      ProductImage: {
        create: {
          productId: '2',
          imageUrl: 'https://example.com/images/milk.jpg',
        },
      },
    },
    {
      name: 'Whole Grain Bread',
      description: 'Freshly baked whole grain bread with seeds.',
      price: 20000, // IDR price
      categoryId: categories[3].id, // Bakery
      storeId: stores[0].id, // Fresh Market
      ProductImage: {
        create: {
          productId: '3',
          imageUrl: 'https://example.com/images/bread.jpg',
        },
      },
    },
    {
      name: 'Free-Range Eggs',
      description: 'Farm fresh free-range eggs, dozen pack.',
      price: 30000, // IDR price
      categoryId: categories[1].id, // Dairy & Eggs
      storeId: stores[1].id, // Organic Grocers
      ProductImage: {
        create: {
          productId: '4',
          imageUrl: 'https://example.com/images/eggs.jpg',
        },
      },
    },
    {
      name: 'Chicken Breast',
      description: 'Boneless, skinless chicken breast, 1 lb pack.',
      price: 45000, // IDR price
      categoryId: categories[2].id, // Meat & Seafood
      storeId: stores[2].id, // Value Supermarket
      ProductImage: {
        create: {
          productId: '5',
          imageUrl: 'https://example.com/images/chicken.jpg',
        },
      },
    },
    {
      name: 'Sparkling Water',
      description: 'Refreshing sparkling water, 12-pack.',
      price: 35000, // IDR price
      categoryId: categories[4].id, // Beverages
      storeId: stores[0].id, // Fresh Market
      ProductImage: {
        create: {
          productId: '6',
          imageUrl: 'https://example.com/images/water.jpg',
        },
      },
    },
    {
      name: 'Potato Chips',
      description: 'Crispy potato chips, lightly salted.',
      price: 12000, // IDR price
      categoryId: categories[5].id, // Snacks
      storeId: stores[2].id, // Value Supermarket
      ProductImage: {
        create: {
          productId: '7',
          imageUrl: 'https://example.com/images/chips.jpg',
        },
      },
    },
    {
      name: 'Canned Tomatoes',
      description: 'Organic diced tomatoes, 14.5 oz can.',
      price: 10000, // IDR price
      categoryId: categories[6].id, // Canned Goods
      storeId: stores[1].id, // Organic Grocers
      ProductImage: {
        create: {
          productId: '8',
          imageUrl: 'https://example.com/images/tomatoes.jpg',
        },
      },
    },
    {
      name: 'Frozen Pizza',
      description: 'Pepperoni pizza, ready to bake.',
      price: 50000, // IDR price
      categoryId: categories[7].id, // Frozen Foods
      storeId: stores[2].id, // Value Supermarket
      ProductImage: {
        create: {
          productId: '9',
          imageUrl: 'https://example.com/images/pizza.jpg',
        },
      },
    },
    {
      name: 'Laundry Detergent',
      description: 'Concentrated laundry detergent, 50 loads.',
      price: 60000, // IDR price
      categoryId: categories[8].id, // Household
      storeId: stores[0].id, // Fresh Market
      ProductImage: {
        create: {
          productId: '10',
          imageUrl: 'https://example.com/images/detergent.jpg',
        },
      },
    },
  ];

  const createdProducts: Product[] = [];
  for (const product of products) {
    const { ProductImage, ...productData } = product;
    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        ProductImage: ProductImage,
      },
    });
    createdProducts.push(createdProduct);
  }
  return createdProducts;
}

async function createStock(products: Product[]) {
  for (const product of products) {
    // Create stock for the product in its store
    const stock = await prisma.stock.create({
      data: {
        productId: product.id,
        storeId: product.storeId,
        quantity: Math.floor(Math.random() * 100) + 20, // Random quantity between 20 and 119
      },
    });

    // Create a stock log entry for initial stock
    await prisma.stockLog.create({
      data: {
        stockId: stock.id,
        change: stock.quantity,
        reason: 'Initial stock',
      },
    });
  }
}

async function createDiscounts(products: Product[]) {
  // Create discounts for some products
  const discountsData = [
    {
      productId: products[0].id, // Apples
      storeId: products[0].storeId,
      type: DiscountType.PERCENTAGE,
      value: 10.0, // 10% off
      minPurchase: 30000, // IDR price
      buyOneGetOne: false,
      maxDiscount: 5000, // IDR price
      code: 'DISCOUNT10', // Added code
    },
    {
      productId: products[2].id, // Bread
      storeId: products[2].storeId,
      type: DiscountType.FIXED_AMOUNT,
      value: 5000, // IDR price off
      minPurchase: null,
      buyOneGetOne: false,
      maxDiscount: 5000, // IDR price
      code: 'BREAD5K', // Added code
    },
    {
      productId: products[4].id, // Chicken
      storeId: products[4].storeId,
      type: DiscountType.PERCENTAGE,
      value: 15.0, // 15% off
      minPurchase: 50000, // IDR price
      buyOneGetOne: false,
      maxDiscount: 15000, // IDR price
      code: 'CHICKEN15', // Added code
    },
    {
      productId: products[6].id, // Chips
      storeId: products[6].storeId,
      type: DiscountType.FIXED_AMOUNT,
      value: 2000, // IDR price off
      minPurchase: null,
      buyOneGetOne: true,
      maxDiscount: 2000, // IDR price
      code: 'CHIPSBOGO', // Added code
    },
  ];

  for (const discountData of discountsData) {
    await prisma.discount.create({
      data: discountData,
    });
  }
}

async function createCarts(users: User[], products: Product[]) {
  // Create cart for regular users
  const regularUsers = users.filter(
    (user) => user.role === 'CUSTOMER' || !user.role,
  );

  for (const user of regularUsers) {
    const cart = await prisma.cart.create({
      data: {
        userId: user.id,
        totalPrice: 0,
      },
    });

    // Add some items to the cart (only for first user to keep it simple)
    if (user.id === regularUsers[0].id) {
      const cartItems = [
        {
          cartId: cart.id,
          productId: products[0].id, // Apples
          quantity: 3,
        },
        {
          cartId: cart.id,
          productId: products[2].id, // Bread
          quantity: 1,
        },
        {
          cartId: cart.id,
          productId: products[5].id, // Water
          quantity: 2,
        },
      ];

      let totalPrice = 0;
      for (const item of cartItems) {
        await prisma.cartItem.create({
          data: item,
        });

        const product = products.find((p) => p.id === item.productId);
        if (product) {
          totalPrice += product.price * item.quantity;
        }
      }

      // Update cart total price
      await prisma.cart.update({
        where: { id: cart.id },
        data: { totalPrice },
      });
    }
  }
}

async function createOrders(
  users: User[],
  products: Product[],
  stores: Store[],
) {
  // Create orders for the first regular user
  const regularUser = users.find(
    (user) => user.role === 'CUSTOMER' || !user.role,
  );

  if (regularUser) {
    // Create a default address for the user if none exists
    let userAddress = await prisma.address.findFirst({
      where: { userId: regularUser.id },
    });

    if (!userAddress) {
      userAddress = await prisma.address.create({
        data: {
          userId: regularUser.id,
          street: '123 Customer Street',
          city: 'Customer City',
          postalCode: 12345,
          isDefault: true,
          latitude: -6.2088,
          longitude: 106.8456,
        },
      });
    }

    // Create a completed order
    const completedOrder = await prisma.order.create({
      data: {
        userId: regularUser.id,
        storeId: stores[0].id,
        orderNumber: 'ORD-' + Date.now().toString().substring(7),
        addressId: userAddress.id,
        orderStatus: OrderStatus.COMPLETED,
        paymentMethod: 'BANK_TRANSFER',
        paymentProof: 'https://example.com/proof.jpg',
        paymentProofTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        paymentDueDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        shippingMethod: 'Standard Delivery',
        shippingCost: 15000, // IDR price
        discountTotal: 10000, // IDR price
        total: 125000, // IDR price
        notes: 'Please leave at the door',
        shippedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
    });

    // Get user's cart
    const userCart = await prisma.cart.findFirst({
      where: { userId: regularUser.id },
    });

    if (userCart) {
      // Create order items for the completed order
      const completedOrderItems = [
        {
          orderId: completedOrder.id,
          cartId: userCart.id,
          productId: products[0].id, // Apples
          quantity: 2,
          price: products[0].price,
        },
        {
          orderId: completedOrder.id,
          cartId: userCart.id,
          productId: products[3].id, // Eggs
          quantity: 1,
          price: products[3].price,
        },
        {
          orderId: completedOrder.id,
          cartId: userCart.id,
          productId: products[7].id, // Canned Tomatoes
          quantity: 3,
          price: products[7].price,
        },
      ];

      for (const item of completedOrderItems) {
        await prisma.orderItem.create({
          data: item,
        });
      }

      // Create a pending order
      const pendingOrder = await prisma.order.create({
        data: {
          userId: regularUser.id,
          storeId: stores[1].id,
          orderNumber: 'ORD-' + (Date.now() + 1).toString().substring(7),
          addressId: userAddress.id,
          orderStatus: OrderStatus.PENDING_PAYMENT,
          paymentMethod: 'PAYMENT_GATEWAY',
          paymentDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
          shippingMethod: 'Express Delivery',
          shippingCost: 25000, // IDR price
          discountTotal: 0,
          total: 175000, // IDR price
          notes: 'Call before delivery',
        },
      });

      // Create order items for the pending order
      const pendingOrderItems = [
        {
          orderId: pendingOrder.id,
          cartId: userCart.id,
          productId: products[1].id, // Milk
          quantity: 2,
          price: products[1].price,
        },
        {
          orderId: pendingOrder.id,
          cartId: userCart.id,
          productId: products[4].id, // Chicken
          quantity: 1,
          price: products[4].price,
        },
        {
          orderId: pendingOrder.id,
          cartId: userCart.id,
          productId: products[8].id, // Frozen Pizza
          quantity: 2,
          price: products[8].price,
        },
      ];

      for (const item of pendingOrderItems) {
        await prisma.orderItem.create({
          data: item,
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
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
