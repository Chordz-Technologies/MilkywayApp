import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginVendor,
  refreshTokenAPI,
  registerVendorAPI,
  addCustomerRegistration,
  addDistributorRegistration,
  logoutUser,
} from '../apiServices/allApi';

interface User {
  userID: string | number;
  role: 'vendor' | 'customer' | 'milkman';
  name?: string;
  contact?: string;
}

interface AuthState {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  access_token: null,
  refresh_token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// ✅ LOGIN - Reads from backend's role-based login response
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { contact: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginVendor(credentials);

      // Correct destructuring — your backend wraps this in .data.data
      const { access, refresh, user_id, role, name, contact } = response.data.data;

      if (access) {await AsyncStorage.setItem('access_token', access);}
      if (refresh) {await AsyncStorage.setItem('refresh_token', refresh);}

      const userInfo: User = {
        userID: user_id,
        role: role.toLowerCase() as User['role'],
        name,
        contact: contact || credentials.contact,
      };
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

      return {
        access_token: access,
        refresh_token: refresh,
        user: userInfo,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        Object.values(error.response?.data || {}).flat()[0] ||
        'Login failed. Please try again';
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ REGISTRATION - vendor
export const registerVendor = createAsyncThunk(
  'auth/registerVendor',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await registerVendorAPI(payload);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Vendor registration failed. Please try again';
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ REGISTRATION - customer
export const registerCustomer = createAsyncThunk(
  'auth/registerCustomer',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await addCustomerRegistration(payload);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Customer registration failed. Please try again';
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ REGISTRATION - distributor
export const registerDistributor = createAsyncThunk(
  'auth/registerDistributor',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await addDistributorRegistration(payload);
      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Distributor registration failed. Please try again';
      return rejectWithValue(errorMessage);
    }
  }
);

// ✅ TOKEN REFRESH - Reads from either .data.data or .data
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refresh_token = await AsyncStorage.getItem('refresh_token');
      if (!refresh_token) {throw new Error('No refresh token available');}

      const response = await refreshTokenAPI({ refresh: refresh_token });
      const { access, refresh: new_refresh_token } = response.data?.data || response.data;

      if (access) {await AsyncStorage.setItem('access_token', access);}
      if (new_refresh_token) {
        await AsyncStorage.setItem('refresh_token', new_refresh_token);
      }

      return {
        access_token: access,
        refresh_token: new_refresh_token || refresh_token,
      };
    } catch (error: any) {
      return rejectWithValue('Token refresh failed');
    }
  }
);

// ✅ LOGOUT - Clears tokens and user info
export const logoutUserAction = createAsyncThunk('auth/logout', async () => {
  try {
    await logoutUser();
  } catch {
    // Ignore API logout errors
  } finally {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
  }
  return true;
});

// ✅ CHECK STORED AUTH
export const checkStoredAuth = createAsyncThunk('auth/checkStored', async () => {
  const token = await AsyncStorage.getItem('access_token');
  const userInfo = await AsyncStorage.getItem('userInfo');

  if (token && userInfo) {
    return {
      access_token: token,
      user: JSON.parse(userInfo),
    };
  }
  throw new Error('No stored authentication');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.isAuthenticated = false;
      state.error = null;
      AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })

      // REGISTRATIONS
      .addCase(registerVendor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerVendor.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerVendor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerCustomer.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerDistributor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerDistributor.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerDistributor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // TOKEN REFRESH
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.isAuthenticated = false;
        AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
      })

      // LOGOUT
      .addCase(logoutUserAction.fulfilled, (state) => {
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.isAuthenticated = false;
        state.error = null;
      })

      // CHECK STORED AUTH
      .addCase(checkStoredAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.access_token = action.payload.access_token;
        state.isAuthenticated = true;
      })
      .addCase(checkStoredAuth.rejected, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
