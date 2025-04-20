import { PrismaClient, Role, User, Product, Store } from '@prisma/client';
import bcrypt from 'bcrypt';
import { fakerID_ID as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean up existing data (optional, but recommended for fresh seeding)
  await cleanDatabase();

  // Seed Users with specific roles and confirm emails
  console.log('👤 Creating users with specific roles and confirming emails...');
  const users = await createUsers();
  console.log(`👤 Created and confirmed ${users.length} users.`);

  // Seed Addresses
  console.log('📍 Creating addresses...');
  const addresses = await createAddresses(users);
  console.log(`📍 Created ${addresses.length} addresses.`);

  // Seed Stores
  console.log('🏢 Creating stores...');
  const stores = await createStores(
    users.filter((user) => user.role === 'STORE_ADMIN'),
  );
  console.log(`🏢 Created ${stores.length} stores.`);

  // Seed Categories
  console.log('🏷️ Creating categories...');
  const categories = await createCategories();
  console.log(`🏷️ Created ${categories.length} categories.`);

  // Seed Products
  console.log('📦 Creating products...');
  const products = await createProducts(categories, stores);
  console.log(`📦 Created ${products.length} products.`);

  // Seed Product Images
  console.log('🖼️ Creating product images...');
  const productImages = await createProductImages(products);
  console.log(`🖼️ Created ${productImages.length} product images.`);

  // Seed Stock
  console.log('Inventory Creating stock...');
  const stock = await createStock(products, stores);
  console.log(`Inventory Created ${stock.length} stock entries.`);

  // Seed Stock Logs
  console.log('📜 Creating stock logs...');
  const stockLogs = await createStockLogs(stock);
  console.log(`📜 Created ${stockLogs.length} stock logs.`);

  // Seed Discounts
  console.log('💰 Creating discounts...');
  const discounts = await createDiscounts(products, stores);
  console.log(`💰 Created ${discounts.length} discounts.`);

  // Seed Vouchers
  console.log('🎟️ Creating vouchers...');
  const vouchers = await createVouchers(products, stores);
  console.log(`🎟️ Created ${vouchers.length} vouchers.`);

  // Seed Discount Reports
  console.log('📊 Creating discount reports...');
  const discountReports = await createDiscountReports(
    users.filter((user) => user.role === 'CUSTOMER'),
    discounts,
  );
  console.log(`📊 Created ${discountReports.length} discount reports.`);

  // Seed Sales Reports
  console.log('📈 Creating sales reports...');
  const salesReports = await createSalesReports(stores, products);
  console.log(`📈 Created ${salesReports.length} sales reports.`);

  // Seed Stock Reports
  console.log('📊 Creating stock reports...');
  const stockReports = await createStockReports(stores, products);
  console.log(`📊 Created ${stockReports.length} stock reports.`);

  // Seed Carts
  console.log('🛒 Creating carts...');
  const carts = await createCarts(
    users.filter((user) => user.role === 'CUSTOMER'),
  );
  console.log(`🛒 Created ${carts.length} carts.`);

  // Seed Cart Items
  console.log('🛍️ Creating cart items...');
  const cartItems = await createCartItems(carts, products);
  console.log(`🛍️ Created ${cartItems.length} cart items.`);

  // Seed Orders
  console.log('🚚 Creating orders...');
  const orders = await createOrders(
    users.filter((user) => user.role === 'CUSTOMER'),
    stores,
    addresses,
  );
  console.log(`🚚 Created ${orders.length} orders.`);

  // Seed Order Items
  console.log('📝 Creating order items...');
  const orderItems = await createOrderItems(orders, products, carts);
  console.log(`📝 Created ${orderItems.length} order items.`);

  console.log('✅ Database seeding completed successfully!');
}

async function cleanDatabase() {
  console.log('🧹 Cleaning database...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.discountReport.deleteMany({});
  await prisma.discount.deleteMany({});
  await prisma.voucher.deleteMany({});
  await prisma.stockLog.deleteMany({});
  await prisma.stock.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.salesReport.deleteMany({}); // Delete Sales Reports first
  await prisma.stockReport.deleteMany({}); // Delete Stock Reports before Products
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.store.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.resetPasswordToken.deleteMany({});
  await prisma.confirmToken.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('🧹 Database cleaned.');
}

async function createUsers() {
  const passwordHash = await bcrypt.hash('secret123', 10);
  const usersData = [
    // Customers
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.CUSTOMER,
      referralCode: faker.string.alphanumeric(8),
      emailConfirmed: true, // Set emailConfirmed to true
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.CUSTOMER,
      referralCode: faker.string.alphanumeric(8),
      emailConfirmed: true, // Set emailConfirmed to true
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.CUSTOMER,
      referralCode: faker.string.alphanumeric(8),
      emailConfirmed: true, // Set emailConfirmed to true
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.CUSTOMER,
      referralCode: faker.string.alphanumeric(8),
      emailConfirmed: true, // Set emailConfirmed to true
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.CUSTOMER,
      referralCode: faker.string.alphanumeric(8),
      emailConfirmed: true, // Set emailConfirmed to true
    },
    // Store Admins
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.STORE_ADMIN,
      referralCode: faker.string.alphanumeric(8),
      emailConfirmed: true, // Set emailConfirmed to true
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.STORE_ADMIN,
      referralCode: faker.string.alphanumeric(8),
      emailConfirmed: true, // Set emailConfirmed to true
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.STORE_ADMIN,
      referralCode: faker.string.alphanumeric(8),
      emailConfirmed: true, // Set emailConfirmed to true
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.STORE_ADMIN,
      referralCode: faker.string.alphanumeric(8),
      emailConfirmed: true, // Set emailConfirmed to true
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: passwordHash,
      role: Role.STORE_ADMIN,
      referralCode: faker.string.alphanumeric(8),
      emailConfirmed: true, // Set emailConfirmed to true
    },
    // Super Admin
    {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: passwordHash,
      role: Role.SUPER_ADMIN,
      referralCode: 'SUPER123',
      emailConfirmed: true, // Set emailConfirmed to true
    },
  ];

  return prisma.user
    .createMany({ data: usersData, skipDuplicates: true })
    .then(() => prisma.user.findMany());
}

async function createAddresses(users: User[]) {
  const addressesData = users.map((user) => ({
    userId: user.id,
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    postalCode: parseInt(faker.location.zipCode('#####')),
    isDefault: faker.datatype.boolean(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
  }));
  return prisma.address
    .createMany({ data: addressesData })
    .then(() => prisma.address.findMany());
}

async function createStores(storeAdmins: User[]) {
  const storesData = storeAdmins.slice(0, 5).map((admin) => ({
    userId: admin.id,
    name: faker.company.name(),
    address: faker.location.streetAddress(),
    latitude: faker.location.latitude(), // Returns number, correct for Float
    longitude: faker.location.longitude(), // Returns number, correct for Float
    maxDistance: faker.number.float({ min: 5, max: 20, fractionDigits: 1 }),
  }));
  return prisma.store
    .createMany({ data: storesData })
    .then(() => prisma.store.findMany());
}

async function createCategories() {
  const categoriesData = Array.from({ length: 5 }, () => ({
    name: faker.commerce.department(),
  }));
  return prisma.category
    .createMany({ data: categoriesData, skipDuplicates: true })
    .then(() => prisma.category.findMany());
}

async function createProducts(
  categories: { id: number }[],
  stores: Store[], // Changed type to Store[]
) {
  const productsData = Array.from({ length: 20 }, () => ({
    // Create 20 products
    storeId: faker.helpers.arrayElement(stores).id,
    categoryId: faker.helpers.arrayElement(categories).id,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
  }));
  return prisma.product
    .createMany({ data: productsData })
    .then(() => prisma.product.findMany());
}

async function createProductImages(products: Product[]) {
  // Changed type to Product[]
  const productImagesData = products.map((product) => ({
    productId: product.id,
    imageUrl: faker.image.url(),
  }));
  return prisma.productImage
    .createMany({ data: productImagesData })
    .then(() => prisma.productImage.findMany());
}

async function createStock(
  products: Product[], // Changed type to Product[]
  _stores: Store[], // Changed type to Store[]
) {
  const stockData = products.map((product) => ({
    storeId: product.storeId, // Now safe to access storeId
    productId: product.id,
    quantity: faker.number.int({ min: 10, max: 200 }),
  }));
  return prisma.stock
    .createMany({ data: stockData })
    .then(() => prisma.stock.findMany());
}

async function createStockLogs(stock: { id: number }[]) {
  const stockLogsData = stock.map((s) => ({
    stockId: s.id,
    change: faker.number.int({ min: -50, max: 50 }),
    reason: faker.lorem.sentence(),
  }));
  return prisma.stockLog
    .createMany({ data: stockLogsData })
    .then(() => prisma.stockLog.findMany());
}

async function createDiscounts(
  products: Product[], // Changed type to Product[]
  stores: Store[], // Changed type to Store[]
) {
  const discountTypes = ['PERCENTAGE', 'FIXED_AMOUNT'] as const;
  const discountsData = Array.from({ length: 5 }, () => ({
    storeId: faker.helpers.arrayElement(stores).id,
    productId: faker.helpers.arrayElement(products).id,
    code: faker.string.alphanumeric(6).toUpperCase(),
    type: faker.helpers.arrayElement(discountTypes),
    value: faker.number.float({ min: 5, max: 50 }),
    minPurchase: faker.datatype.boolean()
      ? faker.number.float({ min: 10, max: 100 })
      : null,
    buyOneGetOne: faker.datatype.boolean(),
    maxDiscount: faker.number.float({ min: 10, max: 100 }),
  }));
  return prisma.discount
    .createMany({ data: discountsData })
    .then(() => prisma.discount.findMany());
}

async function createVouchers(
  products: Product[], // Changed type to Product[]
  stores: Store[], // Changed type to Store[]
) {
  const voucherTypes = [
    'PRODUCT_SPECIFIC',
    'TOTAL_PURCHASE',
    'SHIPPING',
  ] as const;
  const vouchersData = Array.from({ length: 5 }, () => ({
    storeId: faker.helpers.arrayElement(stores).id,
    productId: faker.datatype.boolean()
      ? faker.helpers.arrayElement(products).id
      : null,
    code: faker.string.alphanumeric(8).toUpperCase(),
    type: faker.helpers.arrayElement(voucherTypes),
    value: faker.number.float({ min: 5, max: 30 }),
  }));
  return prisma.voucher
    .createMany({ data: vouchersData })
    .then(() => prisma.voucher.findMany());
}

async function createDiscountReports(
  customers: { id: number }[],
  discounts: { id: number }[],
) {
  const discountReportsData = customers.slice(0, 5).map((customer) => ({
    userId: customer.id,
    dicountId: faker.helpers.arrayElement(discounts).id,
  }));
  return prisma.discountReport
    .createMany({ data: discountReportsData })
    .then(() => prisma.discountReport.findMany());
}

async function createSalesReports(
  stores: Store[], // Changed type to Store[]
  products: Product[], // Changed type to Product[]
) {
  const salesReportsData = Array.from({ length: 5 }, () => ({
    storeId: faker.helpers.arrayElement(stores).id,
    productId: faker.helpers.arrayElement(products).id,
    Quantity: faker.number.int({ min: 1, max: 10 }),
    total: parseFloat(faker.commerce.price()),
    month: faker.number.int({ min: 1, max: 12 }),
    year: new Date().getFullYear(),
    createdAt: faker.date.past(),
  }));
  return prisma.salesReport
    .createMany({ data: salesReportsData })
    .then(() => prisma.salesReport.findMany());
}

async function createStockReports(
  stores: Store[], // Changed type to Store[]
  products: Product[], // Changed type to Product[]
) {
  const stockReportsData = Array.from({ length: 5 }, () => ({
    storeId: faker.helpers.arrayElement(stores).id,
    productId: faker.helpers.arrayElement(products).id,
    startStock: faker.number.int({ min: 50, max: 150 }),
    endStock: faker.number.int({ min: 20, max: 100 }),
    totalAdded: faker.number.int({ min: 10, max: 50 }),
    totalReduced: faker.number.int({ min: 10, max: 50 }),
    month: faker.number.int({ min: 1, max: 12 }),
    year: new Date().getFullYear(),
    createdAt: faker.date.past(),
  }));
  return prisma.stockReport
    .createMany({ data: stockReportsData })
    .then(() => prisma.stockReport.findMany());
}

async function createCarts(customers: { id: number }[]) {
  const cartsData = customers.slice(0, 5).map((customer) => ({
    userId: customer.id,
    totalPrice: 0,
  }));
  return prisma.cart
    .createMany({ data: cartsData })
    .then(() => prisma.cart.findMany());
}


async function createCartItems(
  carts: { id: number }[],
  products: Product[], // Changed type to Product[]
) {
  const cartItemsData = carts.flatMap((cart) =>
    Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      cartId: cart.id,
      productId: faker.helpers.arrayElement(products).id,
      quantity: faker.number.int({ min: 1, max: 5 }),
    })),
  );
  return prisma.cartItem
    .createMany({ data: cartItemsData })
    .then(() => prisma.cartItem.findMany());
}

async function createOrders(
  customers: { id: number }[],
  stores: Store[], // Changed type to Store[]
  addresses: { id: number; userId: number }[],
) {
  const ordersData = customers.slice(0, 5).map((customer) => {
    const customerAddresses = addresses.filter(
      (addr) => addr.userId === customer.id,
    );
    const randomAddress = faker.helpers.arrayElement(customerAddresses);
    return {
      userId: customer.id,
      storeId: faker.helpers.arrayElement(stores).id,
      addressId: randomAddress?.id,
      orderNumber: `ORD-${Date.now()}-${faker.string.alphanumeric(5).toUpperCase()}`, // Removed unnecessary escapes
      orderStatus: faker.helpers.arrayElement([
        'PENDING_PAYMENT',
        'PENDING_CONFIRMATION',
        'PROCESSING',
        'SHIPPED',
        'COMPLETED',
        'CANCELLED',
      ]),
      paymentMethod: faker.helpers.arrayElement(['Midtrans', 'Manual']),
      paymentDueDate: faker.date.future(),
      shippingMethod: faker.helpers.arrayElement([
        'Standard',
        'Express',
        'Same-day',
      ]),
      shippingCost: parseFloat(
        faker.commerce.price({ min: 5000, max: 50000, dec: 0 }),
      ),
      total: parseFloat(
        faker.commerce.price({ min: 50000, max: 500000, dec: 0 }),
      ),
      notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    };
  });
  return prisma.order
    .createMany({ data: ordersData })
    .then(() => prisma.order.findMany());
}

async function createOrderItems(
  orders: { id: string }[],
  products: Product[], // Changed type to Product[]
  carts: { id: number }[],
) {
  const orderItemsData = orders.flatMap((order) => {
    const randomCart = faker.helpers.arrayElement(carts);
    return Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      orderId: order.id,
      cartId: randomCart?.id,
      productId: faker.helpers.arrayElement(products).id,
      quantity: faker.number.int({ min: 1, max: 5 }),
      price: parseFloat(faker.commerce.price()),
    }));
  });
  return prisma.orderItem
    .createMany({ data: orderItemsData })
    .then(() => prisma.orderItem.findMany());
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
