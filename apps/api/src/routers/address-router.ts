import express from 'express';
import {
  addAddress,
  deleteAddress,
  getAddressById,
  getUserAddresses,
  setDefaultAddress,
  updateAddress,
} from '../controllers/address-controller.js';
import { VerifyToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

// All routes require authentication
router.use(VerifyToken);

// Get all addresses for the current user
router.route('/').get(getUserAddresses).post(addAddress);

// Get, update, or delete a specific address
router
  .route('/:id')
  .get(getAddressById)
  .put(updateAddress)
  .delete(deleteAddress);

// Set an address as default
router.route('/:id/default').put(setDefaultAddress);

export default router;
