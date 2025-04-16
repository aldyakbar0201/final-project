import express from 'express';
import {
  createDiscount,
  getDiscounts,
} from '../controllers/discount-controller.js';

const router = express.Router();

router.route('/').get(getDiscounts).post(createDiscount);

export default router;
