import express from 'express';
import {
  createVoucher,
  getVouchers,
} from '../controllers/voucher-controller.js';

const router = express.Router();

router.route('/').get(getVouchers).post(createVoucher);

export default router;
