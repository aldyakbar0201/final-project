import express from 'express';
import {
  getOrders,
  createOrderMidtrans,
  createOrderManual,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/order-controller.js';
import upload from '../middlewares/upload-middleware.js';

const router = express.Router();

router.route('/').get(getOrders).post(createOrderMidtrans);
router
  .route('/manualPayment')
  .post(upload.single('paymentProof'), createOrderManual);
router.route('/update-status').put(updateOrderStatus);
router.route('/delete').delete(deleteOrder);

export default router;
