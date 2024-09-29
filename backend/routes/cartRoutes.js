import {
  addItemToCart,
  applyDiscountCode,
  getCart,
  removeItemFromCart,
  syncCart,
  updateCartItemQuantity,
} from '../controllers/cartController.js';

import { authMiddleware } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

// Add an item to the cart
router.post('/add', authMiddleware, addItemToCart);

// Remove an item from the cart
router.delete('/remove/:productId', authMiddleware, removeItemFromCart);

// Apply a discount code
router.post('/discount', authMiddleware, applyDiscountCode);

// Get cart details
router.get('/', authMiddleware, getCart);

// Update the quantity of a product in the cart
router.put('/update', authMiddleware, updateCartItemQuantity);

// Sync guest cart with the backend after login (logged-in users)
router.post('/sync', authMiddleware, syncCart);

export default router;
