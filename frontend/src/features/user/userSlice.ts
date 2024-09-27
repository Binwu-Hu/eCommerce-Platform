import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUserApi, signupUserApi, sendResetPasswordLinkApi, resetPasswordApi } from '../../api/user';

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

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signupUser = createAsyncThunk(
  'user/signup',
  async (data: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await signupUserApi(data);
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
  async (data: { token: string, password: string }, { rejectWithValue }) => {
    try {
      console.log('Data being sent to API:', data); // Debug log
      const response = await resetPasswordApi(data.token, { password: data.password });
      console.log('Response from API:', response); // Debug log
      return response;
    } catch (error: any) {
      console.error('Error from API:', error.message); // Debug log
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
      state.user = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
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
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;
