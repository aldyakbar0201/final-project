import './configs/env.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import express, { Application, Request, Response } from 'express';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import authRouter from './routers/auth-router.js';
import roleRouter from './routers/role-router.js';
import orderRouter from './routers/order-router.js';
import cartRouter from './routers/cart-router.js';
import voucherRouter from './routers/voucher-router.js';
import discountRouter from './routers/discount-router.js';
import shippingRouter from './routers/shipping-router.js';
import adminRoutes from './routers/admin-router.js';
import productRouter from '../src/routers/product-router.js';
import userRouter from './routers/user-router.js';
import resetPasswordRouter from './routers/reset-password-router.js';
import uploadPhotoRouter from './routers/upload-user-photo-router.js';
import addressRouter from './routers/address-router.js';
import inventoryRouter from './routers/inventory-router.js';
import reportRouter from './routers/report-router.js';
import superAdminRouter from './routers/super-admin-router.js';

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? 'https://www.frshbasket.shop' // Use the correct production domain here
        : 'http://localhost:3000', // For localhost
    credentials: true, // Allow sending credentials (cookies) with requests
  }),
);

app.use(express.json());
// app.use(cookieParser()); // Tambahkan sebelum route

app.get('/api/v1/status', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running' });
});

app.use(cookieParser()); // Tambahkan sebelum route

// Routes admin
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/product', productRouter);
app.use('/api/v1/inventory', inventoryRouter);
app.use('/api/v1/discount', discountRouter);
app.use('/api/v1/report', reportRouter);

//user
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/roles', roleRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/vouchers', voucherRouter);
app.use('/api/v1/discounts', discountRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/shippings', shippingRouter);

//upload user photo
app.use('/api/v1/upload-photo', uploadPhotoRouter);

//reset password
app.use('/api/v1/reset-password', resetPasswordRouter);

//address
app.use('/api/v1/address', addressRouter);

//super admin
app.use('/api/v1/super-admin', superAdminRouter);

//not found and error
app.use(notFoundMiddleware);
app.use(errorMiddleware);

//testing cookies token
app.get('/check-cookies', (req, res) => {
  // console.log('Cookies:', req.cookies);
  res.json({ cookies: req.cookies });
});

app.listen(PORT, () => {
  console.info(`Server is listening on port: ${PORT}`);
});

export default app;
