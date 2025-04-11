import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  sendConfirmationEmail,
} from '../controllers/admin-controller.js';
import {
  authMiddleware,
  superAdminMiddleware,
} from '../middlewares/admin-middleware.js';

const router = express.Router();

// Hanya Super Admin yang bisa mengakses daftar user
router.route('/users').get(superAdminMiddleware, getAllUsers);
router.route('/users/:id').get(superAdminMiddleware, getUserById);

// Hanya Super Admin yang bisa membuat, memperbarui, dan menghapus user
router.route('/users').post(superAdminMiddleware, createUser);
router.route('/users/:id').put(superAdminMiddleware, updateUser);
router.route('/users/:id').delete(superAdminMiddleware, deleteUser);

// Kirim email konfirmasi (bisa diakses oleh Store Admin & Super Admin)
router
  .route('/users/send-confirmation')
  .post(authMiddleware, sendConfirmationEmail);

export default router;
