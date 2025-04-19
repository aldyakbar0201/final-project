import express from 'express';
import { getShippingOptions } from '../controllers/shipping-controller.js';
import { VerifyToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.route('/options').get(VerifyToken, getShippingOptions);

export default router;
