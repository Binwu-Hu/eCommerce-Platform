import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserApi,
  resetPasswordApi,
  sendResetPasswordLinkApi,
  signupUserApi,
} from '../../api/user';

import { syncCart } from '../cart/cartSlice';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const token = localStorage.getItem('token');
const initialState: UserState = {
  user: token ? JSON.parse(localStorage.getItem('user') || '{}') : null, // Load user from localStorage if token exists
  isAuthenticated: !!token, // Set isAuthenticated to true if a token exists
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (
    data: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await loginUserApi(data);
      // Sync the guest cart to the server-side cart after login
      const localCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );
      if (localCartItems.length > 0) {
        dispatch(syncCart(localCartItems));
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Signup user action
export const signupUser = createAsyncThunk(
  'user/signup',
  async (
    data: { name: string; email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await signupUserApi(data);
      // Sync the guest cart to the server-side cart after signup
      const localCartItems = JSON.parse(
        localStorage.getItem('cartItems') || '[]'
      );
      if (localCartItems.length > 0) {
        dispatch(syncCart(localCartItems));
      }
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendResetPasswordLink = createAsyncThunk(
  'user/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await sendResetPasswordLinkApi(email);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: { token: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await resetPasswordApi(data.token, {
        password: data.password,
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token); 
      localStorage.setItem('user', JSON.stringify(action.payload.user)); 
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token); 
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(sendResetPasswordLink.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(sendResetPasswordLink.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(sendResetPasswordLink.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError, setUser } = userSlice.actions;
export default userSlice.reducer;
