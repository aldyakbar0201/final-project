import express from 'express';
import {
  confirmEmail,
  getCurrentUser,
  login,
  logout,
  register,
} from '../controllers/auth-controller.js';
import { VerifyToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/confirm-email').get(confirmEmail);
router.route('/me').get(VerifyToken, getCurrentUser);

export default router;
