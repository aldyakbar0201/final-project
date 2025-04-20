import express from 'express';
import {
  // getCartItems,
  getCartItemById,
  // addToCart,
  removeFromCart,
  updateCartItem,
  getCurrentUserCart,
  getCartQuantity,
  // goToCheckout
} from '../controllers/cart-controllers.js';
import { VerifyToken } from '../middlewares/auth-middleware.js';

const router = express.Router();

// router.route('/').get(getCartItems).post(addToCart);
router.route('/current').get(VerifyToken, getCurrentUserCart);
// router.route('/checkout').post(goToCheckout);
router.route('/remove').delete(removeFromCart);
router.route('/update').put(updateCartItem);
router.route('/cart-quantity').post(VerifyToken, getCartQuantity);
router.route('/:cartItemId').get(getCartItemById);

export default router;
