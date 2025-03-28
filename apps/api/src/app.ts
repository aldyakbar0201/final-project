import './configs/env.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import express, { Application, Request, Response } from 'express';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { VerifyToken } from './middlewares/admin-middleware.js';
import authRouter from './routers/auth-router.js';
import roleRouter from './routers/role-router.js';
import orderRouter from './routers/order-router.js';
import cartRouter from './routers/cart-router.js';
import adminRoutes from './routers/admin-routes.js';
import productRouter from '../src/routers/product-router.js';
import userRouter from './routers/user-router.js';


const app: Application = express();
const PORT = process.env.PORT || 8000;

app.use(cors({ origin: 'http://localhost:3000', credentials: true })); //origin: frshbasket.shop

app.use(express.json());
app.use(cookieParser()); // Tambahkan sebelum route


app.get('/api/v1/status', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'API is running' });
});

// Routes admin
app.use('/api/v1/admin', VerifyToken, adminRoutes);
app.use('/api/v1/product', productRouter);

//user
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/roles', roleRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/users', userRouter);

//not found and error
app.use(notFoundMiddleware);
app.use(errorMiddleware);

//testing cookies token
app.get('/check-cookies', (req, res) => {
  console.log('Cookies:', req.cookies);
  res.json({ cookies: req.cookies });
});

app.listen(PORT, () => {
  console.info(`Server is listening on port: ${PORT}`);
});

export default app;
