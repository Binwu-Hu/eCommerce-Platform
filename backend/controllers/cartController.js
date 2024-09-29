import Cart from '../models/cartModel.js';
import Product from '../models/productModel.js';

const isUserLoggedIn = (req) => {
  return !!req.user; // Check if the user is logged in
};

// Add an item to the cart
export const addItemToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Unlogged-in users
    if (!isUserLoggedIn(req)) {
      return res.status(200).json({ message: 'Store this in localStorage' });
    }

    // Logged-in users
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    const productInCart = cart.items.find(
      (item) => item.product.toString() === productId
    );

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the requested quantity exceeds the stock
    if (
      product.stock <
      quantity + (productInCart ? productInCart.quantity : 0)
    ) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    if (productInCart) {
      // If product already in cart, update the quantity
      productInCart.quantity += quantity;
    } else {
      // Otherwise, add the new product to the cart
      const newCartItem = {
        product: product._id,
        quantity: quantity,
      };
      cart.items.push(newCartItem);
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
};

// Remove an item from the cart
export const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    // Unlogged-in users
    if (!isUserLoggedIn(req)) {
      return res.status(200).json({ message: 'Remove this from localStorage' });
    }

    // Logged-in users
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
};

// Apply a discount code
export const applyDiscountCode = async (req, res) => {
  const { discountCode } = req.body;

  try {
    // Unlogged-in users
    if (!isUserLoggedIn(req)) {
      return res.status(200).json({ message: 'Apply this in localStorage' });
    }

    // Logged-in users
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (discountCode === '20 DOLLAR OFF') {
      cart.discountAmount = 20;
    } else {
      return res.status(400).json({ message: 'Invalid discount code' });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error applying discount code', error });
  }
};

// Get cart details
export const getCart = async (req, res) => {
  try {
    // Unlogged-in users
    if (!isUserLoggedIn(req)) {
        console.log('userid: ', req.user_id);
      return res.status(200).json({ message: 'Get cart from localStorage' });
    }

    // Logged-in users
    console.log("userid: ", req.user_id)
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId }).populate(
      'items.product',
      'name price image'
    );

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.subTotal = cart.items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0
    );
    cart.tax = (cart.subTotal * 0.1).toFixed(2);
    cart.total = (
      cart.subTotal +
      parseFloat(cart.tax) -
      cart.discountAmount
    ).toFixed(2);

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart details', error });
  }
};

// Update item quantity in the cart
export const updateCartItemQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    // Unlogged-in users
    if (!isUserLoggedIn(req)) {
      return res
        .status(200)
        .json({ message: 'Update quantity in localStorage' });
    }

    // Logged-in users
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the requested quantity exceeds the stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    const productInCart = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (productInCart) {
      productInCart.quantity = quantity;
      await cart.save();
      return res.status(200).json(cart);
    }

    return res.status(404).json({ message: 'Product not found in cart' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error updating cart item quantity', error });
  }
};

// Sync guest cart from localStorage after user logs in
export const syncCart = async (req, res) => {
  const { items } = req.body; // Items from the guest cart (localStorage)

  try {
    // Unlogged-in users
    if (!isUserLoggedIn(req)) {
      return res.status(400).json({ message: 'User not logged in' });
    }

    // Logged-in users
    const userId = req.user._id;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    // Loop through the guest cart items
    for (let guestItem of items) {
      const product = await Product.findById(guestItem.product._id);

      if (!product) {
        return res.status(404).json({
          message: `Product not found for ID: ${guestItem.product._id}`,
        });
      }

      const productInCart = cart.items.find(
        (item) => item.product.toString() === guestItem.product._id
      );

      const totalRequestedQuantity =
        guestItem.quantity + (productInCart ? productInCart.quantity : 0);

      // Check if the requested total quantity exceeds the stock
      if (product.stock < totalRequestedQuantity) {
        return res.status(400).json({
          message: `Not enough stock available for product ${product.name}. Available stock: ${product.stock}, requested: ${totalRequestedQuantity}`,
        });
      }

      // If product already exists in the cart, update its quantity
      if (productInCart) {
        productInCart.quantity += guestItem.quantity;
      } else {
        // Otherwise, add the new product to the cart
        cart.items.push({
          product: guestItem.product._id,
          quantity: guestItem.quantity,
        });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error syncing cart', error });
  }
};
