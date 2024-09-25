import express from 'express'

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'
import checkObjectId from '../middleware/checkObjectId.js'

const router = express.Router()

router.route('/').get(getProducts).post(protect, admin, createProduct)

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct)

export default router
