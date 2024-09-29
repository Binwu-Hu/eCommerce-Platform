import { admin, protect } from '../middleware/authMiddleware.js';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/productController.js';

import express from 'express';

const router = express.Router();

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.post('/', protect, admin, createProduct);

router.put('/:id', protect, admin, updateProduct);

router.delete('/:id', protect, deleteProduct);

export default router;
