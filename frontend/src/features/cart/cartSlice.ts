import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface CartItem {
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
  items: [],
  subTotal: 0,
  discountAmount: 0,
  tax: 0,
  total: 0,
  discountCode: null,
  loading: false,
  error: null,
};

// Fetch cart details from the server
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/cart');
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        // If there is a server error
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

// Add item to cart
export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/api/cart/add', {
        productId,
        quantity,
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

// Remove item from cart
export const removeItemFromCart = createAsyncThunk(
  'cart/removeItemFromCart',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/cart/remove/${productId}`);
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

// Update item quantity in cart
export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateCartItemQuantity',
  async (
    { productId, quantity }: { productId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put('/api/cart/update', {
        productId,
        quantity,
      });
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

// Apply discount code
export const applyDiscountCode = createAsyncThunk(
  'cart/applyDiscountCode',
  async (discountCode: string, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/cart/discount', { discountCode });
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

// Sync guest cart to backend after user logs in
export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async (items: CartItem[], { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/cart/sync', { items });
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.subTotal = 0;
      state.discountAmount = 0;
      state.tax = 0;
      state.total = 0;
      state.discountCode = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      return { ...state, ...action.payload };
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Add item to cart
    builder.addCase(addItemToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      state.loading = false;
      return { ...state, ...action.payload };
    });
    builder.addCase(addItemToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Remove item from cart
    builder.addCase(removeItemFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
      state.loading = false;
      return { ...state, ...action.payload };
    });
    builder.addCase(removeItemFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update cart item quantity
    builder.addCase(updateCartItemQuantity.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCartItemQuantity.fulfilled, (state, action) => {
      state.loading = false;
      return { ...state, ...action.payload };
    });
    builder.addCase(updateCartItemQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Apply discount code
    builder.addCase(applyDiscountCode.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(applyDiscountCode.fulfilled, (state, action) => {
      state.loading = false;
      return { ...state, ...action.payload };
    });
    builder.addCase(applyDiscountCode.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Sync guest cart
    builder.addCase(syncCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(syncCart.fulfilled, (state, action) => {
      state.loading = false;
      return { ...state, ...action.payload };
    });
    builder.addCase(syncCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
