import express from 'express';
import {
  confirmEmail,
  login,
  logout,
  register,
} from '../controllers/auth-controller.js';

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/confirm-email').post(confirmEmail);

export default router;
