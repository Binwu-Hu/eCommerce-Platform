const express = require('express');
const {
  addItemToCart,
  removeItemFromCart,
  applyDiscountCode,
  getCart,
  updateCartItemQuantity,
  syncCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Aadd an item to the cart
router.post('/add', addItemToCart);

// Remove an item from the cart
router.delete('/remove/:productId', removeItemFromCart);

// Apply a discount code
router.post('/discount', applyDiscountCode);

// Get cart details
router.get('/', getCart);

//Update the quantity of a product in the cart
router.put('/update', updateCartItemQuantity);

// Route to sync guest cart with the backend after login (logged-in users)
router.post('/sync', protect, syncCart);

module.exports = router;
