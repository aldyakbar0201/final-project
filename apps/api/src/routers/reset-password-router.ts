import express from 'express';
import {
  confirmResetToken,
  requestResetPassword,
  resetPassword,
} from '../controllers/reset-password-controller.js';

const router = express.Router();

router.route('/request-reset-password').post(requestResetPassword);
router.route('/confirm-reset-password').get(confirmResetToken);
router.route('/').put(resetPassword);

export default router;
