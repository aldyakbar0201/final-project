import express from 'express';
import {
  getStockByStore,
  updateStock,
  createStock,
  deleteStock,
} from '../controllers/inventory-controller.js';
import {
  VerifyToken,
  authMiddleware,
} from '../middlewares/admin-middleware.js';

const router = express.Router();

// Middleware yang akan digunakan
router.use(VerifyToken);
router.use(authMiddleware);

// Routes untuk mendapatkan stok berdasarkan toko
router.route('/store/:storeId/stocks').get(getStockByStore);

// Route untuk memperbarui stok produk (Admin/Store Admin)
router.route('/store/:storeId/stock').put(updateStock);

// Route untuk menambahkan stok baru (Admin)
router.route('/store/:storeId/stock').post(createStock);

// Route untuk menghapus stok produk (Admin)
router.route('/store/:storeId/stock/:productId').delete(deleteStock);

export default router;
