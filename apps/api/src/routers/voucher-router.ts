import express from 'express';
import {
  createVoucher,
  getVouchers,
  applyVoucher,
} from '../controllers/voucher-controller.js';

const router = express.Router();

router.route('/').get(getVouchers).post(createVoucher);
router.route('/apply').post(applyVoucher);

export default router;
