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

//need to add protect & admin
router.route('/').get(getProducts).post(createProduct)

router
  .route('/:id')
  .get(checkObjectId, getProductById)
  .put(checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct)

export default router
