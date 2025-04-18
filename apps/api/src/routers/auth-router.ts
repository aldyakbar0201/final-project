import express from 'express';
import {
  confirmEmail,
  editUserData,
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
router.route('/edit-user').patch(VerifyToken, editUserData);

export default router;
