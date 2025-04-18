import express from 'express';
import {
  login,
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  sendConfirmationEmail,
} from '../controllers/admin-controller.js';
import {
  VerifyToken,
  authMiddleware,
  superAdminMiddleware,
} from '../middlewares/admin-middleware.js';

const router = express.Router();

// Semua route dilindungi token
router.use(VerifyToken);

router.route('/login').post(login);

// Hanya Super Admin yang bisa melihat semua user
router.get('/users', superAdminMiddleware, getAllUsers);
router.get('/users/:id', superAdminMiddleware, getUserById);

// Hanya Super Admin yang bisa CRUD user
router.post('/users', superAdminMiddleware, createUser);
router.put('/users/:id', superAdminMiddleware, updateUser);
router.delete('/users/:id', superAdminMiddleware, deleteUser);

// Store Admin dan Super Admin bisa mengirim email konfirmasi
router.post('/users/send-confirmation', authMiddleware, sendConfirmationEmail);

export default router;
