import express from 'express';
import {
  getSalesReportByMonth,
  getSalesReportByCategory,
  getSalesReportByProduct,
  getStockSummaryReport,
  getStockDetailReport,
} from '../controllers/report-controller.js'; // Pastikan path sesuai dengan file controller Anda

const router = express.Router();

// Rute untuk mendapatkan laporan penjualan per bulan
router.route('/sales-reports/month').get(getSalesReportByMonth);

// Rute untuk mendapatkan laporan penjualan per bulan berdasarkan kategori
router.route('/sales-reports/category').get(getSalesReportByCategory);

// Rute untuk mendapatkan laporan penjualan per bulan berdasarkan produk
router.route('/sales-reports/product').get(getSalesReportByProduct);

// Rute untuk mendapatkan ringkasan laporan stok per bulan
router.route('/stock-reports/summary').get(getStockSummaryReport);

// Rute untuk mendapatkan detail laporan stok per produk per bulan
router.route('/stock-reports/detail').get(getStockDetailReport);

export default router;
