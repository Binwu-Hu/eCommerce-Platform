import {
  addItemToCart,
  applyDiscountCode,
  getCart,
  removeItemFromCart,
  syncCart,
  updateCartItemQuantity,
} from '../controllers/cartController.js';

import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add an item to the cart
router.post('/add', addItemToCart);

// Remove an item from the cart
router.delete('/remove/:productId', removeItemFromCart);

// Apply a discount code
router.post('/discount', applyDiscountCode);

// Get cart details
router.get('/', getCart);

// Update the quantity of a product in the cart
router.put('/update', updateCartItemQuantity);

// Sync guest cart with the backend after login (logged-in users)
router.post('/sync', authMiddleware, syncCart);

export default router;
