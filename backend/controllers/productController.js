import Product from '../models/productModel.js';
import multer from 'multer';
import path from 'path';

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'data/uploads/'); // Folder to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ); // File naming
  },
});

// File type validation
const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!'); // Reject file if it's not an image
  }
};

// Initialize multer with storage settings and file filter
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// @desc Upload product image
// @route POST /api/products/upload
// @access Private (admin only)
export const uploadProductImage = (req, res) => {
  if (req.file) {
    res.status(200).json({ imageUrl: `/${req.file.path}` }); // Return the image path
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
};

// @desc   Get all products
// @route  GET /api/products
// @access Public
export const getAllProducts = async (req, res) => {
  try {
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: 'i' } }
      : {};
    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc   Get a product by ID
// @route  GET /api/products/:id
// @access Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc   Create a new product
// @route  POST /api/products
// @access Private (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, image } = req.body;
    const owner = req.user ? req.user._id : null;

    const newProduct = new Product({
      name,
      description,
      category,
      price,
      stock,
      image,
      owner,
    });

    const createdProduct = await newProduct.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
};

// @desc   Update a product by ID
// @route  PUT /api/products/:id
// @access Private (admin only)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, category, price, stock, image } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        message:
          'All fields must be provided: name, description, category, price, stock, image',
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Authorization check
    if (
      product.owner.toString() !== req.user?._id.toString() &&
      !req.user?.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this product' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.image = image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating product', error: error.message });
  }
};

// @desc   Delete a product by ID
// @route  DELETE /api/products/:id
// @access Private (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this product' });
    }

    await Product.deleteOne({ _id: product._id });
    // await product.remove();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting product', error: error.message });
  }
};
