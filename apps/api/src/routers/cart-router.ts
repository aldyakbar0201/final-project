import express from 'express';
import {
  getCartItems,
  getCartItemById,
  addToCart,
  removeFromCart,
  updateCartItem,
  getCurrentUserCart,
} from '../controllers/cart-controllers.js';

const router = express.Router();

router.route('/').get(getCartItems).post(addToCart);
router.route('/current').get(getCurrentUserCart);
router.route('/remove').delete(removeFromCart);
router.route('/update').put(updateCartItem);
router.route('/:cartItemId').get(getCartItemById);

export default router;
