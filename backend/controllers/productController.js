import Product from '../models/productModel.js';

// @desc   Get all products
// @route  GET /api/products
// @access Public
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
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
    const { name, description, category, price, stock, image, owner } =
      req.body;

    const ownerExists = await User.findById(owner);
    if (!ownerExists) {
      return res.status(404).json({ message: 'Owner not found' });
    }

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

    const product = await Product.findById(req.params.id);

    if (
      product.owner.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this product' });
    }

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.price = price || product.price;
      product.stockQuantity = stockQuantity || product.stockQuantity;
      product.image = image || product.image;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
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

    await product.remove();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error deleting product', error: error.message });
  }
};
