import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Product } from '../product/productSlice';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  subTotal: number;
  discountAmount: number;
  tax: number;
  total: number;
  discountCode: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
  subTotal: 0,
  discountAmount: 0,
  tax: 0,
  total: 0,
  discountCode: null,
  loading: false,
  error: null,
};

const saveCartToLocalStorage = (items: CartItem[]) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
};

// Helper function to calculate totals
const calculateTotals = (state: CartState) => {
  state.subTotal = state.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  state.tax = state.subTotal * 0.1; // Example 10% tax
  state.total = state.subTotal + state.tax - state.discountAmount;
};


// Fetch cart details (from server if authenticated, from localStorage if not)
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const { user } = getState() as { user: { isAuthenticated: boolean } };

    if (user.isAuthenticated) {
      // Fetch cart from the server for authenticated users
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        return rejectWithValue(
          error.response?.data || 'Something went wrong fetching the cart'
        );
      }
    } else {
      // Unauthenticated users: fetch cart from localStorage and get product details
      const localCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );
      console.log('localCartItems: ', localCartItems);

      if (localCartItems.length > 0) {
        return { items: localCartItems };
      } else {
        return { items: [] };
      }
    }
  }
);

// Add item to cart (both localStorage and server)
export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    const { user, products } = getState() as {
      user: { isAuthenticated: boolean };
      products: { products: Product[] };
    };

    if (user.isAuthenticated) {
      // Authenticated users (server-side cart)
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          '/api/cart/add',
          { productId, quantity },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        return rejectWithValue(
          error.response?.data || 'Something went wrong adding item to the cart'
        );
      }
    } else {
      // Guest users (localStorage)
      let product = products.products.find((p) => p._id === productId);
      if (!product) {
        // If product not in state, fetch the product details from the API
        try {
          const response = await axios.get(`/api/products/${productId}`);
          product = response.data;
        } catch (err) {
          const error = err as AxiosError;
          return rejectWithValue(
            error.response?.data || 'Error fetching product details'
          );
        }
      }

      // Ensure product details are available before adding to the cart
      if (!product) {
        return rejectWithValue('Product not found');
      }

      // Dispatch local cart action for guest users
      dispatch(
        addItemToCartLocal({
          productId,
          quantity,
          name: product.name,
          price: product.price,
          image: product.image,
        })
      );
    }
  }
);

// Remove item from cart (both localStorage and server)
export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (productId: string, { getState, dispatch, rejectWithValue }) => {
    const { user } = getState() as { user: { isAuthenticated: boolean } };

    if (user.isAuthenticated) {
      // Authenticated users (server-side cart)
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`/api/cart/remove/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        return rejectWithValue(
          error.response?.data ||
            'Something went wrong removing item from the cart'
        );
      }
    } else {
      // Guest users (localStorage)
      dispatch(removeItemFromCartLocal(productId));
    }
  }
);

// Update item quantity in cart (both localStorage and server)
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { getState, dispatch, rejectWithValue }
  ) => {
    const { user } = getState() as { user: { isAuthenticated: boolean } };

    if (user.isAuthenticated) {
      // Authenticated users (server-side cart)
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          '/api/cart/update',
          {
            productId,
            quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        return rejectWithValue(
          error.response?.data ||
            'Something went wrong updating cart item quantity'
        );
      }
    } else {
      // Guest users (localStorage)
      dispatch(updateCartItemQuantityLocal({ productId, quantity }));
    }
  }
);

// Apply discount code (both localStorage and server)
export const applyDiscountCode = createAsyncThunk(
  'cart/applyDiscountCode',
  async (discountCode: string, { getState, dispatch, rejectWithValue }) => {
    const { user } = getState() as { user: { isAuthenticated: boolean } };

    if (user.isAuthenticated) {
      // Authenticated users (server-side cart)
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          '/api/cart/discount',
          { discountCode },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        return rejectWithValue(
          error.response?.data || 'Something went wrong applying discount code'
        );
      }
    } else {
      // Guest users (localStorage)
      dispatch(applyDiscountCodeLocal(discountCode));
    }
  }
);

// Sync guest cart to backend after user logs in
export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (localCartItems: CartItem[], { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        '/api/cart/sync',
        { items: localCartItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem('cartItems'); // Clear localStorage after syncing
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data || 'Something went wrong syncing the cart'
      );
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // For unauthenticated users (localStorage operations)
    addItemToCartLocal: (state, action) => {
      const { productId, quantity, name, price, image } = action.payload;

      const existingItem = state.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        const newItem: CartItem = {
          productId,
          quantity,
          name,
          price,
          image,
        };
        state.items.push(newItem);
      }
      saveCartToLocalStorage(state.items);
      calculateTotals(state);
    },

    removeItemFromCartLocal: (state, action) => {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload
      );
      saveCartToLocalStorage(state.items);
      calculateTotals(state);
    },

    updateCartItemQuantityLocal: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((item) => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
      saveCartToLocalStorage(state.items);
      calculateTotals(state);
    },

    applyDiscountCodeLocal: (state, action) => {
      state.discountCode = action.payload;
      state.discountAmount = 20; // Just a dummy value, change based on your logic
      calculateTotals(state); // Update totals
    },

    resetCart: (state) => {
      state.items = [];
      state.subTotal = 0;
      state.discountAmount = 0;
      state.tax = 0;
      state.total = 0;
      state.discountCode = null;
      localStorage.removeItem('cartItems'); // Clear localStorage
    },
  },
  extraReducers: (builder) => {
    // Fetch cart (server-side)
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      calculateTotals(state); // Calculate totals after fetching
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add Item to Cart
    builder.addCase(addItemToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      calculateTotals(state);
    });
    builder.addCase(addItemToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove Item from Cart
    builder.addCase(removeItemFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      calculateTotals(state);
    });
    builder.addCase(removeItemFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Item Quantity
    builder.addCase(updateCartItemQuantity.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCartItemQuantity.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      calculateTotals(state);
    });
    builder.addCase(updateCartItemQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Apply Discount Code
    builder.addCase(applyDiscountCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(applyDiscountCode.fulfilled, (state, action) => {
      state.loading = false;
      state.discountCode = action.payload.discountCode;
      state.discountAmount = action.payload.discountAmount;
      calculateTotals(state);
    });
    builder.addCase(applyDiscountCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Sync guest cart with server after login
    builder.addCase(syncCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(syncCart.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.items;
      calculateTotals(state); // Calculate totals after syncing
    });
    builder.addCase(syncCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  addItemToCartLocal,
  removeItemFromCartLocal,
  updateCartItemQuantityLocal,
  applyDiscountCodeLocal,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
