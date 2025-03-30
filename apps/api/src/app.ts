import './configs/env.js';
import cors from 'cors';

import express, { Application, Request, Response } from 'express';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { VerifyToken } from './middlewares/admin-middleware.js';

import authRouter from './routers/auth-router.js';
import roleRouter from './routers/role-router.js';
import orderRouter from './routers/order-router.js';
import cartRouter from './routers/cart-router.js';
import voucherRouter from './routers/voucher-router.js';
import discountRouter from './routers/discount-router.js';
import adminRoutes from './routers/admin-routes.js';
import cookieParser from 'cookie-parser';
import userRouter from './routers/user-router.js';

const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true })); //origin: frshbasket.shop

app.use(express.json());

app.use(cookieParser());

app.get('/api/v1/status', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running' });
});

// Routes admin
app.use('/api/v1/admin', VerifyToken, adminRoutes);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/roles', roleRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/vouchers', voucherRouter);
app.use('/api/v1/discounts', discountRouter);
app.use('/api/v1/users', userRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.info(`Server is listening on port: ${PORT}`);
});

export default app;
