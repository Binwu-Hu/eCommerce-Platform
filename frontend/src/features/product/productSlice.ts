import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  owner: string;
}

interface ProductState {
  products: Product[];
  product?: Product;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/products');
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    if (axios.isAxiosError(error)) {
      const errorMessage =
        typeof error.response?.data === 'string'
          ? error.response.data
          : 'Failed to fetch products';
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    const response = await axios.get(`/api/products/${id}`);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    if (axios.isAxiosError(error)) {
      const errorMessage =
        typeof error.response?.data === 'string'
          ? error.response.data
          : `Failed to fetch product with ID ${id}`;
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

// Create a new product
export const createProduct = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>('products/createProduct', async (productData, { rejectWithValue }) => {
  try {
    const response = await axios.post('/api/products', productData);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    if (axios.isAxiosError(error)) {
      const errorMessage =
        typeof error.response?.data === 'string'
          ? error.response.data
          : 'Failed to create product';
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

// Update a product by ID
export const updateProduct = createAsyncThunk<
  Product,
  { id: string; data: Partial<Product> },
  { rejectValue: string }
>('products/updateProduct', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axios.put(`/api/products/${id}`, data);
    return response.data;
  } catch (err) {
    const error = err as AxiosError;
    if (axios.isAxiosError(error)) {
      const errorMessage =
        typeof error.response?.data === 'string'
          ? error.response.data
          : `Failed to update product with ID ${id}`;
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

// Delete a product by ID
export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`/api/products/${id}`);
    return id;
  } catch (err) {
    const error = err as AxiosError;
    if (axios.isAxiosError(error)) {
      const errorMessage =
        typeof error.response?.data === 'string'
          ? error.response.data
          : `Failed to delete product with ID ${id}`;
      return rejectWithValue(errorMessage);
    }
    return rejectWithValue('An unknown error occurred');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch product by ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products.push(action.payload);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.products.findIndex(
        (p) => p._id === action.payload._id
      );
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = state.products.filter(
        (product) => product._id !== action.payload
      );
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
