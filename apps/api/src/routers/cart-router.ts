import express from 'express';
import {
  getCartItems,
  addToCart,
  removeFromCart,
  updateCartItem,
} from '../controllers/cart-controllers.js';

const router = express.Router();

router.route('/').get(getCartItems).post(addToCart);
router.route('/remove').delete(removeFromCart);
router.route('/update').put(updateCartItem);

export default router;
