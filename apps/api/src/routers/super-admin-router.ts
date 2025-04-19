import express from 'express';
import { VerifyToken } from '../middlewares/auth-middleware.js';
import {
  getAllStores,
  createStore,
  updateStore,
  deleteStore,
  assignStoreAdmin,
} from '../controllers/super-admin-controller.js';

const router = express.Router();

router.use(VerifyToken);

router.route('/stores').get(getAllStores).post(createStore);
router.route('/stores/:id').patch(updateStore).delete(deleteStore);
router.route('/assign-store-admin').post(assignStoreAdmin);

export default router;
