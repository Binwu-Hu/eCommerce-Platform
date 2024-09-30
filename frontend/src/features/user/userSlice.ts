import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserApi,
  resetPasswordApi,
  sendResetPasswordLinkApi,
  signupUserApi,
} from '../../api/user';
import { resetCart, syncCart } from '../cart/cartSlice';

import { AxiosError } from 'axios';

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

// Retrieve user and token from localStorage
const token = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

// Initial state with localStorage rehydration
const initialState: UserState = {
  user:
    storedUser && storedUser !== 'undefined' && storedUser !== 'null'
      ? JSON.parse(storedUser)
      : null,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (
    data: { email: string; password: string, isAdmin: boolean },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await loginUserApi(data);

      localStorage.setItem('token', response.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: response._id,
          name: response.name,
          email: response.email,
          isAdmin: response.isAdmin,
        })
      );

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

// Async action for signing up the user
export const signupUser = createAsyncThunk(
  'user/signup',
  async (
    data: { name: string; email: string; password: string, isAdmin: boolean },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await signupUserApi(data);

      localStorage.setItem('token', response.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: response._id,
          name: response.name,
          email: response.email,
          isAdmin: response.isAdmin,
        })
      );

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
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data || 'Error sending reset password link.'
      );
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
    } catch (err) {
      const error = err as AxiosError;
      return rejectWithValue(
        error.response?.data || 'Error reseting password.'
      );
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
      localStorage.removeItem('cartItems');
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
      console.log('loginUser payload:', action.payload);
      console.log('loginUser payload:', action.payload);
      state.loading = false;
      state.isAuthenticated = true;

      state.user = {
        id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        isAdmin: action.payload.isAdmin,
        token: action.payload.token,
      };

      localStorage.setItem('token', action.payload.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAdmin: action.payload.isAdmin,
        })
      );
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
      state.user = {
        id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        isAdmin: action.payload.isAdmin,
        token: action.payload.token,
      };
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          isAdmin: action.payload.isAdmin,
        })
      );
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
