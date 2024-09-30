import express from 'express';
import path from 'path';
import multer from 'multer';
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct, uploadProductImage } from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'data/uploads/'); // Folder to store uploaded files
    },
    filename(req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  });
  
  const upload = multer({ storage }); // Initialize multer with storage

const router = express.Router();

const __dirname = path.resolve(); // Resolve the current directory
router.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from 'uploads'

router.get('/', getAllProducts);
router.get('/:id', getProductById);

router.post('/', authMiddleware, createProduct);
router.put('/:id', authMiddleware, updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);
router.post('/upload', authMiddleware, upload.single('image'), uploadProductImage);

export default router;
