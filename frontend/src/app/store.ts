import { configureStore } from '@reduxjs/toolkit';
import productReducer from '../features/product/productSlice';
import userReducer from '../features/user/userSlice';

export default configureStore({
  reducer: {
    product: productReducer,
    user: userReducer,
  },
  devTools: true,
});
