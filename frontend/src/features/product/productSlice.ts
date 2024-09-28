// export default productSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { PRODUCTS_URL, UPLOAD_URL } from '../../constants'

// Define types for your state
interface Product {
  _id: string
  name: string
  price: number
  description: string
  image: string
  stock: number
  brand: string
  category: string
}

interface ProductState {
  products: Product[]
  loading: boolean
  productDetails?: Product | null
  error?: string | null
  page: number
  pages: number
  totalProducts: number
}

const initialState: ProductState = {
  products: [],
  loading: false,
  productDetails: null,
  error: null,
  page: 1,
  pages: 1,
  totalProducts: 0,
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({
    keyword = '',
    pageNumber = '',
  }: {
    keyword?: string
    pageNumber?: string
  }) => {
    const { data } = await axios.get(PRODUCTS_URL, {
      params: { keyword, pageNumber },
    })
    // Expecting data to contain products, page, and pages from the backend response
    return data
  }
)

// Fetch Product Details (replace RTK Query getProductDetails)
export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (productId: string) => {
    const response = await axios.get(`${PRODUCTS_URL}/${productId}`)
    return response.data
  }
)

// Create a Product (replace RTK Query createProduct)
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async () => {
    const response = await axios.post(PRODUCTS_URL)
    return response.data
  }
)

// Update a Product (replace RTK Query updateProduct)
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (data: { productId: string; productData: Partial<Product> }) => {
    const { productId, productData } = data
    const response = await axios.put(
      `${PRODUCTS_URL}/${productId}`,
      productData
    )
    return response.data
  }
)

// Upload Product Image (replace RTK Query uploadProductImage)
export const uploadProductImage = createAsyncThunk(
  'products/uploadProductImage',
  async (formData: FormData) => {
    const response = await axios.post(UPLOAD_URL, formData)
    return response.data
  }
)

// Delete a Product (replace RTK Query deleteProduct)
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string) => {
    await axios.delete(`${PRODUCTS_URL}/${productId}`)
    return productId
  }
)

// Slice (similar to the apiSlice in RTK Query)
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchProducts actions

    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.page = action.payload.page
        state.pages = action.payload.pages
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch products'
      })

    // Handle fetchProductDetails actions
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true
        state.productDetails = null
        state.error = null
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false
        state.productDetails = action.payload
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch product details'
      })

    // Handle createProduct actions
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products.push(action.payload) // add the newly created product
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create product'
      })

    // Handle updateProduct actions
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        )
        if (index !== -1) {
          state.products[index] = action.payload // update the product
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update product'
      })

    // Handle uploadProductImage actions
    builder
      .addCase(uploadProductImage.pending, (state) => {
        state.loading = true
      })
      .addCase(uploadProductImage.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(uploadProductImage.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to upload product image'
      })

    // Handle deleteProduct actions
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.products = state.products.filter((p) => p._id !== action.payload) // remove product from state
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete product'
      })
  },
})

export default productSlice.reducer
